module.exports = router => {

  router.get('/regions', (req, res) => {
    const data = req.session.data

    const currentRegion = res.locals.currentOrganisation

    const organisations = data.organisations.filter((organisation) => (organisation.region === currentRegion.id) && (["Active", "Invited", "Deactivated"].includes(organisation.status)))

    const closedOrganisationsCount = data.organisations.filter((organisation) => (organisation.region === currentRegion.id && organisation.status == "Closed")).length

    res.render('regions/index', {
      organisations,
      closedOrganisationsCount
    })
  })

  router.get('/regions/organisations/closed', (req, res) => {
    const currentRegion = res.locals.currentOrganisation

    const data = req.session.data
    const organisations = data.organisations.filter((organisation) => (organisation.region === currentRegion.id && organisation.status == "Closed"))

    res.render('regions/closed-organisations', {
      organisations
    })
  })

  router.get('/regions/review/:id', (req, res) => {
    const data = req.session.data
    const organisation = data.allOrganisations.find((org) => org.id === req.params.id)

    res.render('regions/organisation-request', {
      organisation
    })
  })

  router.get('/regions/accept/:id', (req, res) => {
    const data = req.session.data
    const organisation = data.allOrganisations.find((org) => org.id === req.params.id)

    res.render('regions/accept', {
      organisation
    })
  })

  // Inviting an organisation
  router.post('/regions/add', (req, res) => {
    const data = req.session.data
    const currentRegion = res.locals.currentOrganisation

    const organisationId = data.organisationId
    const organisation = data.allOrganisations.find((org) => org.id === organisationId)

    const addedUserId = Math.floor(Math.random() * 10000000).toString()

    // Add organisation
    req.session.data.organisations.push({
      id: organisation.id,
      name: organisation.name,
      address: organisation.address,
      type: organisation.type,
      status: 'Invited',
      region: currentRegion.id
    })

    req.session.data.users.push({
      id: addedUserId,
      email: req.session.data.email,
      status: 'Invited',
      firstName: data.firstName,
      lastName: data.lastName,
      organisations: [
        {
          id: organisation.id,
          status: "Invited",
          permissionLevel: "Lead administrator"
        }
      ]
    })

    // Remove data from adding organisation flow
    req.session.data.email = ''
    req.session.data.organisationId = ''
    req.session.data.firstName = ''
    req.session.data.lastName = ''

    res.redirect('/regions/organisations/' + organisationId)
  })

  router.get('/regions/organisation-details', (req, res) => {
    const data = req.session.data
    const organisationId = data.organisationId
    const organisation = data.allOrganisations.find((organisation) => organisation.id === organisationId)

    res.render('regions/organisation-details', {
      organisation
    })
  })

  router.get('/regions/add-email', (req, res) => {
    const data = req.session.data
    const organisationId = data.organisationId
    const organisation = data.allOrganisations.find((organisation) => organisation.id === organisationId)

    res.render('regions/add-email', {
      organisation
    })
  })

  router.get('/regions/check-and-send', (req, res) => {
    const data = req.session.data
    const organisationId = data.organisationId
    const organisation = data.allOrganisations.find((organisation) => organisation.id === organisationId)


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
          vaccinator: false
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

    const vaccines = organisation.vaccines || []
    const vaccinesEnabled = vaccines.filter((vaccine) => vaccine.status === "enabled")

    const messages = res.locals.currentOrganisation.inbox.filter((message) => message.fromOrganisationId === id)

    res.render('regions/organisation', {
      organisation,
      users,
      vaccinesEnabled,
      messages
    })
  })

  // Viewing the page to set vaccines per organisation
  router.get('/regions/organisations/:id/add-vaccines', (req, res) => {
    const data = req.session.data
    const id = req.params.id
    const organisation = data.organisations.find((org) => org.id === id)
    if (!organisation) { res.redirect('/regions/'); return }

    const organisationVaccines = organisation.vaccines || []
    const vaccineEnabledNames = organisationVaccines.filter((vaccine) => vaccine.status === "enabled").map((vaccine) => vaccine.name)

    const allVaccines = data.vaccines

    const vaccinesNotYetAdded = allVaccines.filter((vaccine) => !vaccineEnabledNames.includes(vaccine.name))

    res.render('regions/add-vaccines', {
      organisation,
      vaccinesNotYetAdded
    })
  })

  // Updating vaccines enabled per organisation
  router.post('/regions/organisations/:id/update-vaccines', (req, res) => {
    const data = req.session.data
    const id = req.params.id
    const organisation = data.organisations.find((org) => org.id === id)
    if (!organisation) { res.redirect('/regions/'); return }

    const vaccinesToAdd = data.vaccinesToAdd

    const vaccines = organisation.vaccines || []

    for (let vaccineToAdd of vaccinesToAdd) {

      const existingVaccine = vaccines.find((vaccine) => vaccine.name === vaccineToAdd)

      if (existingVaccine) {
        existingVaccine.status = "enabled"
      } else {

        vaccines.push({
          name: vaccineToAdd,
          status: "enabled"
        })
      }

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
    const inbox = res.locals.currentOrganisation.inbox

    res.render('regions/messages/index', {
      inbox
    })
  })

  router.get('/regions/messages/:id', (req, res) => {
    const id = req.params.id

    const inbox = res.locals.currentOrganisation.inbox
    const message = inbox.find((message) => message.id === id)

    res.render('regions/messages/show', {
      message
    })
  })

  router.post('/regions/messages/:id/decide', (req, res) => {
    const data = req.session.data
    const id = req.params.id

    const inbox = res.locals.currentOrganisation.inbox
    const message = inbox.find((message) => message.id === id)

    const decision = data.decision

    const fromOrganisation = data.organisations.find((organisation) => organisation.id === message.fromOrganisationId)

    let vaccines = fromOrganisation.vaccines.filter((vaccine) => message.vaccinesRequested.includes(vaccine.name))

    for (let vaccine of vaccines) {
      if (decision === "approve") {
        vaccine.status = "enabled"
      } else if (decision === "reject") {
        vaccine.status = "disabled"
      }
    }

    inbox.splice(inbox.indexOf(message), 1)

    res.redirect('/regions/messages')
  })

}
