module.exports = router => {

  router.get('/regions/v1', (req, res) => {
    const data = req.session.data
    const organisations = data.organisations.filter((organisation) => organisation.region === "Y61")

    res.render('regions/v1/index', {
      organisations
    })
  })

  // Inviting an organisation
  router.post('/regions/v1/add', (req, res) => {
    req.session.data.organisationsAdded ||= []

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

    // Add organisation to `organisationsAdded` array
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

    res.redirect('/regions/v1/organisations/' + organisationCode)
  })

  router.get('/regions/v1/organisation-details', (req, res) => {
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

    res.render('regions/v1/organisation-details', {
      organisation
    })
  })

  router.get('/regions/v1/add-email', (req, res) => {
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
      code: organisationCode,
      name: organisationName,
      type: organisationType,
      address: {
        line1: organisationLine1,
        town: organisationTown,
        postcode: organisationPostcode
      }
    }

    res.render('regions/v1/add-email', {
      organisation
    })
  })

  router.get('/regions/v1/check-and-send', (req, res) => {
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
      code: organisationCode,
      name: organisationName,
      type: organisationType,
      address: {
        line1: organisationLine1,
        town: organisationTown,
        postcode: organisationPostcode
      }
    }

    res.render('regions/v1/check-and-send', {
      organisation
    })
  })

  // Inviting a second lead user for an organisation
  router.post('/regions/v1/organisations/:code/add', (req, res) => {
    const organisationsAdded = req.session.data.organisationsAdded || []
    const organisation = organisationsAdded.find((org) => org.code === req.params.code)
    if (!organisation) { res.redirect('/regions/v1/'); return }

    const addedUserId = Math.floor(Math.random() * 10000000).toString()

    organisation.leadUsers.push({
      id: addedUserId,
      email: req.session.data.email,
      status: 'Invited',
      firstName: req.session.data.firstName,
      lastName: req.session.data.lastName
    })

    // Reset data
    req.session.data.email = ''
    req.session.data.firstName = ''
    req.session.data.lastName = ''

    res.redirect('/regions/v1/organisations/' + organisation.code)
  })

  // Viewing an organisation
  router.get('/regions/v1/organisations/:code', (req, res) => {
    const organisationsAdded = req.session.data.organisationsAdded || []
    const organisation = organisationsAdded.find((org) => org.code === req.params.code)
    if (!organisation) { res.redirect('/regions/v1/'); return }

    res.render('regions/v1/organisation', {
      organisation
    })
  })

  // Delete an organisation confirmation page
  router.get('/regions/v1/organisations/:code/delete', (req, res) => {
    const organisationsAdded = req.session.data.organisationsAdded || []
    const organisation = organisationsAdded.find((org) => org.code === req.params.code)
    if (!organisation) { res.redirect('/regions/v1/'); return }

    res.render('regions/v1/delete-organisation', {
      organisation
    })
  })

  // Deleting an organisation
  router.post('/regions/v1/organisations/:code/deleted', (req, res) => {
    const organisationsAdded = req.session.data.organisationsAdded || []
    const organisation = organisationsAdded.find((org) => org.code === req.params.code)
    if (!organisation) { res.redirect('/regions/v1/'); return }

    // Remove organisation from the array of organisations added
    req.session.data.organisationsAdded.splice(req.session.data.organisationsAdded.indexOf(organisation), 1)

    res.redirect('/regions/v1')
  })

  // Add another lead user to an organisation form
  router.get('/regions/v1/organisations/:code/add-email', (req, res) => {
    const organisationsAdded = req.session.data.organisationsAdded || []
    const organisation = organisationsAdded.find((org) => org.code === req.params.code)
    if (!organisation) { res.redirect('/regions/v1/'); return }

    res.render('regions/v1/add-another-email', {
      organisation
    })
  })

  // Check a second lead user for an organisation
  router.get('/regions/v1/organisations/:code/add-email-check', (req, res) => {
    const organisationsAdded = req.session.data.organisationsAdded || []
    const organisation = organisationsAdded.find((org) => org.code === req.params.code)
    if (!organisation) { res.redirect('/regions/v1/'); return }

    res.render('regions/v1/add-another-email-check', {
      organisation
    })
  })

  // Uninvite page for a user
  router.get('/regions/v1/organisations/:code/users/:id/uninvite', (req, res) => {
    const organisationsAdded = req.session.data.organisationsAdded || []
    const organisation = organisationsAdded.find((org) => org.code === req.params.code)
    if (!organisation) { res.redirect('/regions/v1/'); return }

    const user = organisation.leadUsers.find((user) => user.id === req.params.id)
    if (!user || user.status == 'Active') { res.redirect(`/regions/v1/organisations/${organisation.code}`); return }

    const numberOfActiveUsers =  organisation.leadUsers.filter((user) => user.status === "Active").length

    res.render('regions/v1/uninvite', {
      organisation,
      user,
      numberOfActiveUsers
    })
  })

  // Uninvite a user
  router.post('/regions/v1/organisations/:code/users/:id/uninvited', (req, res) => {
    const organisationsAdded = req.session.data.organisationsAdded || []
    const organisation = organisationsAdded.find((org) => org.code === req.params.code)
    if (!organisation) { res.redirect('/regions/v1/'); return }

    const user = organisation.leadUsers.find((user) => user.id === req.params.id)
    if (!user) { res.redirect(`/regions/v1/organisations/${organisation.code}`); return }

    organisation.leadUsers.splice(organisation.leadUsers.indexOf(user), 1)

    // Remove the organisation if no lead users are left
    if (organisation.leadUsers.filter((user) => user.status === "Active").length === 0) {
      organisationsAdded.splice(organisationsAdded.indexOf(organisation), 1)
      res.redirect('/regions/v1/')
    } else {
      res.redirect('/regions/v1/organisations/' + organisation.code)
    }

  })
}
