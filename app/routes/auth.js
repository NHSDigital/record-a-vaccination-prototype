module.exports = router => {

  const asArray = (value) => {
    if (value === undefined || value === null) {
      return []
    }

    return Array.isArray(value) ? value : [value]
  }

  const getDefaultLandingPath = (data, organisationId) => {
    const organisation = (data.organisations || []).find((item) => item.id === organisationId)

    if (!organisation) {
      return '/home'
    }

    if (organisation.type === 'Region') {
      return '/regions'
    }

    if (organisation.type !== 'Pharmacy HQ' && organisation.appointmentsInterfaceEnabled !== false) {
      return '/appointments'
    }

    if (organisation.type !== 'Pharmacy HQ') {
      return '/record-vaccinations'
    }

    return '/home'
  }

  const getCurrentUserFromSessionData = (data) => {
    if (!data) {
      return null
    }

    if (data.currentUserId) {
      return (data.users || []).find((user) => user.id === data.currentUserId) || null
    }

    if (data.email) {
      return (data.users || []).find((user) => user.email === data.email) || null
    }

    return null
  }

  router.get('/auth/restore-organisation', (req, res) => {
    const data = req.session.data
    const previousOrganisationId = data.previousOrganisationId
    const previousOrganisation = (data.organisations || []).find((organisation) => organisation.id === previousOrganisationId)

    if (!previousOrganisationId) {
      return res.redirect('/auth/select-organisation')
    }

    data.currentOrganisationId = previousOrganisationId
    delete data.previousOrganisationId

    if (previousOrganisation && previousOrganisation.type === 'Pharmacy HQ') {
      return res.redirect('/pharmacies')
    }

    res.redirect(getDefaultLandingPath(data, previousOrganisationId))
  })

  const isTemporaryAccessInactive = (addedOnIsoDate, deactivatedOnIsoDate) => {
    if (deactivatedOnIsoDate) {
      return true
    }

    if (!addedOnIsoDate) {
      return false
    }

    const expiryDate = new Date(`${addedOnIsoDate}T12:00:00`)
    expiryDate.setDate(expiryDate.getDate() + 7)

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return expiryDate < today
  }

  const getGroupAdminSwitchContext = (data, user) => {
    if (!data || !user) {
      return {
        isEligible: false,
        groupOrganisation: null,
        temporaryPharmacies: []
      }
    }

    const activeGroupAdminOrganisationIds = (user.organisations || [])
      .filter((organisation) => organisation.permissionLevel === 'Group administrator' && organisation.status === 'Active')
      .map((organisation) => organisation.id)

    const groupOrganisation = (data.organisations || []).find((organisation) => {
      return organisation.type === 'Pharmacy HQ' && activeGroupAdminOrganisationIds.includes(organisation.id)
    })

    if (!groupOrganisation) {
      return {
        isEligible: false,
        groupOrganisation: null,
        temporaryPharmacies: []
      }
    }

    const temporaryPharmacyIds = [...new Set(asArray(data.groupAdminTemporaryPharmacyIds))]
    const temporaryPharmacyAddedDates = data.groupAdminTemporaryPharmacyAddedDates || {}
    const temporaryPharmacyDeactivatedDates = data.groupAdminTemporaryPharmacyDeactivatedDates || {}

    const temporaryPharmacies = temporaryPharmacyIds
      .map((pharmacyId) => {
        const organisation = (data.organisations || []).find((item) => item.id === pharmacyId)

        return {
          organisation,
          addedOn: temporaryPharmacyAddedDates[pharmacyId],
          deactivatedOn: temporaryPharmacyDeactivatedDates[pharmacyId]
        }
      })
      .filter((item) => item.organisation)
      .filter((organisation) => {
        return organisation.organisation.status === 'Active' && organisation.organisation.companyId === groupOrganisation.id
      })
      .filter((item) => {
        return !isTemporaryAccessInactive(item.addedOn, item.deactivatedOn)
      })
      .map((item) => item.organisation)

    return {
      isEligible: temporaryPharmacies.length > 1,
      groupOrganisation,
      temporaryPharmacies
    }
  }

  router.post('/auth/sign-in', (req, res) => {

    const data = req.session.data
    const email = data.email
    const user = data.users.find((user) => user.email === email)

    if (email === 'freda.pink@nhs.net') {
      res.redirect('/auth/user-not-recognised')
      return
    } else if (email === 'james.blue@nhs.net') {
      res.redirect('/auth/keycloak-existing-account-new-login')
      return
    } else if (!user) {
      res.redirect('/auth/okta-sign-in')
      return
    }

    const userOrganisationIds = (user.organisations || [])
      .filter((organisation) => organisation.status === "Active")
      .map((organisation) => organisation.id)

    const userRegionIds = (user.regions || [])
      .filter((organisation) => organisation.status === "Active")
      .map((organisation) => organisation.id)


    if (user.admin) {
      req.session.data.currentUserId = user.id;
      req.session.data.currentOrganisationId = null
      res.redirect('/support')

    } else if (userOrganisationIds.length === 1) {

      req.session.data.currentUserId = user.id;
      req.session.data.currentOrganisationId = userOrganisationIds[0]

      res.redirect(getDefaultLandingPath(data, userOrganisationIds[0]))

    } else if (userRegionIds.length === 1) {

      req.session.data.currentUserId = user.id
      req.session.data.currentOrganisationId = userRegionIds[0]

      res.redirect('/regions')

    } else {

      res.redirect('/auth/select-organisation')

    }

  })

  router.get('/auth/select-organisation', (req, res) => {
    const data = req.session.data

    const email = data.email
    const user = data.users.find((user) => user.email === email)
    const from = req.query.from

    if (!user) {
      res.redirect('/auth/okta-sign-in')
      return
    }

    const userOrganisationIds = user.organisations.map((organisation) => organisation.id)
    const organisations = data.organisations.filter((organisation) => userOrganisationIds.includes(organisation.id) )

    res.render('auth/select-organisation', {
      organisations,
      from
    })

  })

  router.post('/select-organisation', (req, res) => {
    const data = req.session.data
    const selectedOrganisationId = data.organisationId
    const email = data.email
    const user = data.users.find((user) => user.email === email)

    if (!user) {
      res.redirect('/auth/okta-sign-in')
      return
    }

    if (selectedOrganisationId) {
      req.session.data.currentUserId = user.id
      req.session.data.currentOrganisationId = selectedOrganisationId;

      res.redirect(getDefaultLandingPath(data, selectedOrganisationId))
    } else {

      res.redirect('/auth/select-organisation')
    }
  })

  router.get('/auth/switch-organisation/work-type', (req, res) => {
    const data = req.session.data
    const user = getCurrentUserFromSessionData(data)
    const context = getGroupAdminSwitchContext(data, user)

    if (!user || !context.isEligible) {
      return res.redirect('/auth/select-organisation')
    }

    res.render('auth/switch-work-type', {
      groupOrganisation: context.groupOrganisation
    })
  })

  router.post('/auth/switch-organisation/work-type', (req, res) => {
    const data = req.session.data
    const user = getCurrentUserFromSessionData(data)
    const context = getGroupAdminSwitchContext(data, user)
    const switchOrganisationWorkType = req.body.switchOrganisationWorkType

    if (!user || !context.isEligible) {
      return res.redirect('/auth/select-organisation')
    }

    if (!switchOrganisationWorkType) {
      return res.render('auth/switch-work-type', {
        groupOrganisation: context.groupOrganisation,
        error: {
          text: 'Select the type of work you want to do'
        }
      })
    }

    if (switchOrganisationWorkType === 'group-admin') {
      data.currentOrganisationId = context.groupOrganisation.id
      return res.redirect(getDefaultLandingPath(data, context.groupOrganisation.id))
    }

    if (switchOrganisationWorkType === 'individual-pharmacy') {
      return res.redirect('/auth/switch-organisation/select-pharmacy')
    }

    res.render('auth/switch-work-type', {
      groupOrganisation: context.groupOrganisation,
      error: {
        text: 'Select the type of work you want to do'
      }
    })
  })

  router.get('/auth/switch-organisation/select-pharmacy', (req, res) => {
    const data = req.session.data
    const user = getCurrentUserFromSessionData(data)
    const context = getGroupAdminSwitchContext(data, user)

    if (!user || !context.isEligible) {
      return res.redirect('/auth/select-organisation')
    }

    res.render('auth/select-pharmacy-for-access', {
      groupOrganisation: context.groupOrganisation,
      pharmacies: context.temporaryPharmacies
    })
  })

  router.post('/auth/switch-organisation/select-pharmacy', (req, res) => {
    const data = req.session.data
    const user = getCurrentUserFromSessionData(data)
    const context = getGroupAdminSwitchContext(data, user)
    const switchOrganisationPharmacyId = req.body.switchOrganisationPharmacyId

    if (!user || !context.isEligible) {
      return res.redirect('/auth/select-organisation')
    }

    const isValidSelection = context.temporaryPharmacies.some((pharmacy) => pharmacy.id === switchOrganisationPharmacyId)

    if (!switchOrganisationPharmacyId || !isValidSelection) {
      return res.render('auth/select-pharmacy-for-access', {
        groupOrganisation: context.groupOrganisation,
        pharmacies: context.temporaryPharmacies,
        error: {
          text: 'Select a pharmacy to access'
        }
      })
    }

    data.currentOrganisationId = switchOrganisationPharmacyId
    res.redirect(getDefaultLandingPath(data, switchOrganisationPharmacyId))
  })

  router.get('/sign-out', (req, res) => {
    req.session.data.currentUserId = null
    req.session.data.currentOrganisationId = null
    req.session.data.email = ""

    res.redirect('/product-page')
  })

}
