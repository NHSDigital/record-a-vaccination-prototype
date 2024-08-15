module.exports = router => {
  // Inviting an organisation
  router.post('/regions/v1/add', (req, res) => {
    req.session.data.organisationsAdded ||= []

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

    // Add organisation to `organisationsAdded` array
    req.session.data.organisationsAdded.push({
      code: req.session.data.organisationCode,
      name: organisationName,
      address: {
        line1: organisationLine1,
        town: organisationTown,
        postcode: organisationPostcode
      },
      type: organisationType,
      leadUsers: [
        {
          email: req.session.data.email,
          status: 'Invited',
          firstName: req.session.data.firstName,
          lastName: req.session.data.lastName
        }
      ],
      status: 'Invited'
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

    organisation.leadUsers.push({
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

    res.render('regions/v1/organisation', {
      organisation
    })
  })

  // Add another lead user to an organisation form
  router.get('/regions/v1/organisations/:code/add-email', (req, res) => {
    const organisationsAdded = req.session.data.organisationsAdded || []
    const organisation = organisationsAdded.find((org) => org.code === req.params.code)

    res.render('regions/v1/add-another-email', {
      organisation
    })
  })

  // Check a second lead user for an organisation
  router.get('/regions/v1/organisations/:code/add-email-check', (req, res) => {
    const organisationsAdded = req.session.data.organisationsAdded || []
    const organisation = organisationsAdded.find((org) => org.code === req.params.code)

    res.render('regions/v1/add-another-email-check', {
      organisation
    })
  })

  // Mock up more organisations having been added
  router.get('/regions/v1/setup-test', (req, res) => {
    req.session.data.organisationsAdded ||= []

    // Add an NHS Trust
    req.session.data.organisationsAdded.push({
      code: 'RD8',
      name: 'Milton Keynes University Hospital NHS Foundation Trust',
      address: {
        line1: 'Standing Way, Eaglestone',
        town: 'Milton Keynes',
        postcode: 'MK6 5LD'
      },
      type: 'NHS Trust',
      status: 'Active',
      leadUsers: [
        {
          email: 'sarah.jane@mk.nhs.net',
          status: 'Active',
          firstName: 'Sarah',
          lastName: 'Jane'
        }
      ]
    })

    // Add another NHS Trust
    req.session.data.organisationsAdded.push({
      code: 'RAJ',
      name: 'Mid and South Essex NHS Foundation Trust',
      address: {
        line1: 'Prittlewell Chase',
        town: 'Westcliffe-on-Sea',
        postcode: 'SS0 0RY'
      },
      type: 'NHS Trust',
      status: 'Active',
      leadUsers: [
        {
          firstName: 'Richard',
          lastName: 'Jones',
          email: 'richard.jones@mid-essex.nhs.net',
          status: 'Active'
        }
      ]
    })

    // Add another NHS Trust
    req.session.data.organisationsAdded.push({
      code: 'FA424',
      name: 'Pickfords Pharmacy',
      address: {
        line1: '8 Spencer Court',
        town: 'Corby',
        postcode: 'NN17 1NU'
      },
      type: 'Community Pharmacy',
      status: 'Active',
      leadUsers: [
        {
          firstName: 'Sara',
          lastName: 'Pickford',
          email: 'sara.pickford@pickford-pharmacy.com',
          status: 'Active'
        }
      ]
    })

    res.redirect('/regions/v1')
  })
}
