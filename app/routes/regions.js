module.exports = router => {

  router.get('/regions', (req, res) => {
    const data = req.session.data
    const organisations = data.organisations.filter((organisation) => (organisation.region === "Y61") && (["Active", "Invited", "Deactivated"].includes(organisation.status)))

    const closedOrganisationsCount = data.organisations.filter((organisation) => (organisation.region === "Y61" && organisation.status == "Closed")).length

    res.render('regions/index', {
      organisations,
      closedOrganisationsCount
    })
  })

  router.get('/regions/organisations/closed', (req, res) => {
    const data = req.session.data
    const organisations = data.organisations.filter((organisation) => (organisation.region === "Y61" && organisation.status == "Closed"))

    res.render('regions/closed-organisations', {
      organisations
    })
  })

  router.get('/regions/review/:id', (req, res) => {
    const data = req.session.data
    const organisation = data.organisations.find((org) => org.id === req.params.id)

    res.render('regions/organisation-request', {
      organisation
    })
  })

  router.get('/regions/accept/:id', (req, res) => {
    const data = req.session.data
    const organisation = data.organisations.find((org) => org.id === req.params.id)

    res.render('regions/accept', {
      organisation
    })
  })

  // Inviting an organisation
  router.post('/regions/add', (req, res) => {

    const organisationCode = req.session.data.organisationCode
    const addedUserId = Math.floor(Math.random() * 10000000).toString()

    let organisationName, organisationLine1, organisationTown, organisationPostcode, organisationType

    if (organisationCode.startsWith('FA')) {
      organisationName = req.session.data.nhsPharmacies[organisationCode].name
      organisationLine1 = req.session.data.nhsPharmacies[organisationCode].address
      organisationTown = req.session.data.nhsPharmacies[organisationCode].town
      organisationPostcode = req.session.data.nhsPharmacies[organisationCode].postcode
      organisationType = 'Community Pharmacy'
    } else {
      organisationName = req.session.data.nhsTrusts[organisationCode]
      organisationLine1 = 'Cobbett House, Oxford Road'
      organisationTown = 'Manchester'
      organisationPostcode = 'M13 9WL'
      organisationType = 'NHS Trust'
    }

    // Add organisation
    req.session.data.organisations.push({
      id: req.session.data.organisationCode,
      name: organisationName,
      address: {
        line1: organisationLine1,
        town: organisationTown,
        postcode: organisationPostcode
      },
      type: organisationType,
      status: 'Invited',
      region: "Y61"
    })

    req.session.data.users.push({
      id: addedUserId,
      email: req.session.data.email,
      status: 'Invited',
      firstName: req.session.data.firstName,
      lastName: req.session.data.lastName,
      organisations: [
        {
          id: req.session.data.organisationCode,
          status: "Invited",
          permissionLevel: "Lead administrator"
        }
      ]
    })

    // Remove data from adding organisation flow
    req.session.data.email = ''
    req.session.data.organisationCode = ''
    req.session.data.firstName = ''
    req.session.data.lastName = ''

    res.redirect('/regions/organisations/' + organisationCode)
  })

  router.get('/regions/organisation-details', (req, res) => {
    const organisationCode = req.session.data.organisationCode

    let organisationName, organisationLine1, organisationTown, organisationPostcode, organisationType, legallyClosed

    if (organisationCode.startsWith('FA')) {
      organisationName = req.session.data.nhsPharmacies[organisationCode].name
      organisationLine1 = req.session.data.nhsPharmacies[organisationCode].address
      organisationTown = req.session.data.nhsPharmacies[organisationCode].town
      organisationPostcode = req.session.data.nhsPharmacies[organisationCode].postcode
      legallyClosed = req.session.data.nhsPharmacies[organisationCode].legallyClosed
      organisationType = 'Community Pharmacy'
    } else {
      organisationName = req.session.data.nhsTrusts[organisationCode]
      legallyClosed = false
      organisationLine1 = 'Cobbett House, Oxford Road'
      organisationTown = 'Manchester'
      organisationPostcode = 'M13 9WL'
      organisationType = 'NHS Trust'
    }

    const organisation = {
      code: organisationCode,
      name: organisationName,
      type: organisationType,
      address: {
        line1: organisationLine1,
        town: organisationTown,
        postcode: organisationPostcode
      },
      legallyClosed: legallyClosed
    }

    res.render('regions/organisation-details', {
      organisation
    })
  })

  router.get('/regions/add-email', (req, res) => {
    const organisationCode = req.session.data.organisationCode

    let organisationName, organisationLine1, organisationTown, organisationPostcode, organisationType

    if (organisationCode.startsWith('FA')) {
      organisationName = req.session.data.nhsPharmacies[organisationCode].name
      organisationLine1 = req.session.data.nhsPharmacies[organisationCode].address
      organisationTown = req.session.data.nhsPharmacies[organisationCode].town
      organisationPostcode = req.session.data.nhsPharmacies[organisationCode].postcode
      organisationType = 'Community Pharmacy'
    } else {
      organisationName = req.session.data.nhsTrusts[organisationCode]
      organisationLine1 = 'Cobbett House, Oxford Road'
      organisationTown = 'Manchester'
      organisationPostcode = 'M13 9WL'
      organisationType = 'NHS Trust'
    }

    const organisation = {
      id: organisationCode,
      name: organisationName,
      type: organisationType,
      address: {
        line1: organisationLine1,
        town: organisationTown,
        postcode: organisationPostcode
      }
    }

    res.render('regions/add-email', {
      organisation
    })
  })

  router.get('/regions/check-and-send', (req, res) => {
    const organisationCode = req.session.data.organisationCode

    let organisationName, organisationLine1, organisationTown, organisationPostcode, organisationType

    if (organisationCode.startsWith('FA')) {
      organisationName = req.session.data.nhsPharmacies[organisationCode].name
      organisationLine1 = req.session.data.nhsPharmacies[organisationCode].address
      organisationTown = req.session.data.nhsPharmacies[organisationCode].town
      organisationPostcode = req.session.data.nhsPharmacies[organisationCode].postcode
      organisationType = 'Community Pharmacy'
    } else {
      organisationName = req.session.data.nhsTrusts[organisationCode]
      organisationLine1 = '73 Roman Rd'
      organisationTown = 'Leeds'
      organisationPostcode = 'LS2 5ZN'
      organisationType = 'NHS Trust'
    }

    const organisation = {
      id: organisationCode,
      name: organisationName,
      type: organisationType,
      address: {
        line1: organisationLine1,
        town: organisationTown,
        postcode: organisationPostcode
      }
    }

    res.render('regions/check-and-send', {
      organisation
    })
  })

  // Inviting a second lead user for an organisation
  router.post('/regions/organisations/:id/add', (req, res) => {
    const data = req.session.data
    const organisation = data.organisations.find((org) => org.id === req.params.id)
    if (!organisation) { res.redirect('/regions/'); return }

    const addedUserId = Math.floor(Math.random() * 10000000).toString()

    req.session.data.users.push({
      id: addedUserId,
      email: req.session.data.email,
      status: 'Invited',
      firstName: req.session.data.firstName,
      lastName: req.session.data.lastName,
      organisations: [
        {
          id: organisation.id,
          status: 'Invited',
          permissionLevel: 'Lead administrator',
          clinician: false
        }
      ]
    })

    // Reset data
    req.session.data.email = ''
    req.session.data.firstName = ''
    req.session.data.lastName = ''

    res.redirect('/regions/organisations/' + organisation.id)
  })

  // Viewing an organisation
  router.get('/regions/organisations/:id', (req, res) => {
    const data = req.session.data
    const id = req.params.id
    const organisation = data.organisations.find((org) => org.id === id)
    if (!organisation) { res.redirect('/regions/'); return }

    const users = data.users.filter((user) => (user.organisations || []).find((organisation) => organisation.id === id))

    const vaccines = organisation.vaccines
    const vaccinesEnabled = vaccines.filter((vaccine) => vaccine.status === "enabled")

    res.render('regions/organisation', {
      organisation,
      users,
      vaccinesEnabled
    })
  })

  // Viewing the page to set vaccines per organisation
  router.get('/regions/organisations/:id/change-vaccines', (req, res) => {
    const data = req.session.data
    const id = req.params.id
    const organisation = data.organisations.find((org) => org.id === id)
    if (!organisation) { res.redirect('/regions/'); return }

    const vaccines = organisation.vaccines
    const vaccinesEnabled = vaccines.filter((vaccine) => vaccine.status === "enabled")

    res.render('regions/change-vaccines', {
      organisation,
      vaccinesEnabled
    })
  })

  // Updating vaccines enabled per organisation
  router.post('/regions/organisations/:id/update-vaccines', (req, res) => {
    const data = req.session.data
    const id = req.params.id
    const organisation = data.organisations.find((org) => org.id === id)
    if (!organisation) { res.redirect('/regions/'); return }

    const vaccinesEnabled = data.vaccinesEnabled

    for (vaccine of organisation.vaccines) {
      vaccine.status = (vaccinesEnabled.includes(vaccine.name) ? "enabled" : "disabled")
    }

    res.redirect(`/regions/organisations/${id}`)
  })


  // Delete an organisation confirmation page
  router.get('/regions/organisations/:id/delete', (req, res) => {
    const organisation = req.session.data.organisations.find((org) => org.id === req.params.id)
    if (!organisation) { res.redirect('/regions/'); return }

    res.render('regions/delete-organisation', {
      organisation
    })
  })

  // Deleting an organisation
  router.post('/regions/organisations/:id/deleted', (req, res) => {
    const organisation = req.session.data.organisations.find((org) => org.id === req.params.id)
    if (!organisation) { res.redirect('/regions/'); return }

    // Remove organisation
    req.session.data.organisations.splice(req.session.data.organisations.indexOf(organisation), 1)

    res.redirect('/regions')
  })

  // Add another lead user to an organisation form
  router.get('/regions/organisations/:id/add-email', (req, res) => {
    const data = req.session.data
    const organisation = data.organisations.find((org) => org.id === req.params.id)
    if (!organisation) { res.redirect('/regions/'); return }

    res.render('regions/add-another-email', {
      organisation
    })
  })

  // Deactivate an organisation
  router.get('/regions/organisations/:id/deactivate', (req, res) => {
    const data = req.session.data
    const organisation = data.organisations.find((org) => org.id === req.params.id)
    if (!organisation) { res.redirect('/regions/'); return }

    res.render('regions/deactivate', {
      organisation
    })
  })

  // Deactivating an organisation
  router.post('/regions/organisations/:id/deactivated', (req, res) => {
    const organisation = req.session.data.organisations.find((org) => org.id === req.params.id)
    if (!organisation) { res.redirect('/regions/'); return }

    organisation.status = "Deactivated"

    res.redirect('/regions/organisations/' + organisation.id)
  })

  // Reactivate an organisation
  router.get('/regions/organisations/:id/reactivate', (req, res) => {
    const data = req.session.data
    const organisation = data.organisations.find((org) => org.id === req.params.id)
    if (!organisation) { res.redirect('/regions/'); return }

    res.render('regions/reactivate', {
      organisation
    })
  })

  // Reactivating an organisation
  router.post('/regions/organisations/:id/reactivated', (req, res) => {
    const organisation = req.session.data.organisations.find((org) => org.id === req.params.id)
    if (!organisation) { res.redirect('/regions/'); return }

    organisation.status = "Active"

    res.redirect('/regions/organisations/' + organisation.id)
  })


  // Check a second lead user for an organisation
  router.get('/regions/organisations/:id/add-email-check', (req, res) => {
    const data = req.session.data
    const organisation = data.organisations.find((org) => org.id === req.params.id)
    if (!organisation) { res.redirect('/regions/'); return }

    res.render('regions/add-another-email-check', {
      organisation
    })
  })

  // Uninvite page for a user
  router.get('/regions/organisations/:id/users/:userId/uninvite', (req, res) => {
    const data = req.session.data
    const organisation = data.organisations.find((org) => org.id === req.params.id)
    if (!organisation) { res.redirect('/regions/'); return }

    const user = data.users.find((user) => user.id === req.params.userId)

    const userOrganisationSettings = (user.organisations || []).find((organisation) => organisation.id === organisation.id)

    // if (!user || userOrganisationSettings.status == 'Active') { res.redirect(`/regions/organisations/${organisation.id}`); return }

    const numberOfActiveUsers = data.users.filter((user) => (user.organisations || []).find((orgSetting) => (orgSetting.id === organisation.id ) && (orgSetting.status === 'Active'))).length

    res.render('regions/uninvite', {
      organisation,
      user,
      numberOfActiveUsers
    })
  })

  // Uninvite a user
  router.post('/regions/organisations/:id/users/:userId/uninvited', (req, res) => {
    const data = req.session.data
    const { id, userId } = req.params;
    const organisation = data.organisations.find((org) => org.id === req.params.id)
    if (!organisation) { res.redirect('/regions/'); return }

    const user = data.users.find((user) => user.id === userId)
    if (!user) { res.redirect(`/regions/organisations/${organisation.id}`); return }

    const organisationSetting = user.organisations.find((org) => org.id === id)

    // Remove the organisation from the user
    user.organisations.splice(user.organisations.indexOf(organisationSetting), 1)

    const numberOfUsersAtOrganisation = data.users.filter((user) => (user.organisations || []).find((org) => org.id === id)).length

    // Remove the organisation if no lead users are left
    if (numberOfUsersAtOrganisation === 0) {
      data.organisations.splice(data.organisations.indexOf(organisation), 1)
      res.redirect('/regions/')
    } else {
      res.redirect('/regions/organisations/' + organisation.id)
    }

  })

  router.get('/regions/messages', (req, res) => {
    const data = req.session.data

    const currentOrganisation = data.regions.find((region) => region.id === "Y62")

    const inbox = currentOrganisation.inbox

    res.render('regions/messages/index', {
      currentOrganisation,
      inbox
    })
  })

  router.get('/regions/messages/:id', (req, res) => {
    const data = req.session.data
    const id = req.params.id

    const currentOrganisation = data.regions.find((region) => region.id === "Y62")
    const inbox = currentOrganisation.inbox
    const message = inbox.find((message) => message.id === id)

    res.render('regions/messages/show', {
      message
    })
  })

}
