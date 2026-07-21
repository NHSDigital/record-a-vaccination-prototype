const { getPharmaciesBelongingToOrganisation, getOrganisation } = require('../lib/ods');
const { byName } = require('../lib/utils/by-name');


const sortByNameThenPostcode = (getPostcode = (item) => item.postcode) => (a, b) => {
  if (a.name < b.name) return -1
  if (a.name > b.name) return 1
  const postcodeA = getPostcode(a)
  const postcodeB = getPostcode(b)
  if (postcodeA < postcodeB) return -1
  return 1
}

const hasVaccinationRecords = (data, organisationId) => {
  return (data.vaccinationsRecorded || []).some((record) => record.organisationId === organisationId)
}

const scenarioCompanyIds = ['P0191N', 'P15951']

const isoDaysAgo = (daysAgo) => {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return date.toISOString()
}

const buildDefaultScenarioUsersForPharmacy = (organisation) => {
  if (!organisation || !scenarioCompanyIds.includes(organisation.companyId) || organisation.addedByUser) {
    return []
  }

  const defaultDeactivatorName = organisation.companyId === 'P15951'
    ? 'Amanda White'
    : 'Paulina Sloan'

  return [
    {
      id: `default-${organisation.id}-invited-old`,
      firstName: 'Ava',
      lastName: 'Patel',
      email: 'ava.patel@nhs.net',
      organisations: [
        {
          id: organisation.id,
          permissionLevel: 'Recorder',
          status: 'Invited',
          vaccinator: true,
          inviteSent: isoDaysAgo(10)
        }
      ]
    },
    {
      id: `default-${organisation.id}-invited-recent`,
      firstName: 'Noah',
      lastName: 'Carter',
      email: 'noah.carter@nhs.net',
      organisations: [
        {
          id: organisation.id,
          permissionLevel: 'Administrator',
          status: 'Invited',
          vaccinator: false,
          inviteSent: isoDaysAgo(4)
        }
      ]
    },
    {
      id: `default-${organisation.id}-deactivated-inactive`,
      firstName: 'Mia',
      lastName: 'Thompson',
      email: 'mia.thompson@nhs.net',
      lastLogIn: isoDaysAgo(91).split('T')[0],
      organisations: [
        {
          id: organisation.id,
          permissionLevel: 'Recorder',
          status: 'Deactivated',
          vaccinator: true,
          deactivatedDate: isoDaysAgo(1).split('T')[0],
          deactivatedReason: '90 days since login'
        }
      ]
    },
    {
      id: `default-${organisation.id}-deactivated-by-user`,
      firstName: 'Leo',
      lastName: 'Nguyen',
      email: 'leo.nguyen@nhs.net',
      lastLogIn: isoDaysAgo(12).split('T')[0],
      organisations: [
        {
          id: organisation.id,
          permissionLevel: 'Administrator',
          status: 'Deactivated',
          vaccinator: false,
          deactivatedDate: isoDaysAgo(2).split('T')[0],
          deactivatedReason: 'Deactivated by user',
          deactivatedBy: defaultDeactivatorName
        }
      ]
    },
    ...(organisation.id === 'FQ3U12' ? [
      {
        id: `default-${organisation.id}-active-1`,
        firstName: 'Sophie',
        lastName: 'Clarke',
        email: 'sophie.clarke@nhs.net',
        lastLogIn: isoDaysAgo(3).split('T')[0],
        organisations: [{ id: organisation.id, permissionLevel: 'Recorder', status: 'Active', vaccinator: true }]
      },
      {
        id: `default-${organisation.id}-active-2`,
        firstName: 'Daniel',
        lastName: 'Foster',
        email: 'daniel.foster@nhs.net',
        lastLogIn: isoDaysAgo(7).split('T')[0],
        organisations: [{ id: organisation.id, permissionLevel: 'Recorder', status: 'Active', vaccinator: false }]
      },
      {
        id: `default-${organisation.id}-active-3`,
        firstName: 'Priya',
        lastName: 'Sharma',
        email: 'priya.sharma@nhs.net',
        lastLogIn: isoDaysAgo(1).split('T')[0],
        organisations: [{ id: organisation.id, permissionLevel: 'Administrator', status: 'Active', vaccinator: true }]
      },
      {
        id: `default-${organisation.id}-active-4`,
        firstName: 'Marcus',
        lastName: 'Webb',
        email: 'marcus.webb@nhs.net',
        lastLogIn: isoDaysAgo(14).split('T')[0],
        organisations: [{ id: organisation.id, permissionLevel: 'Recorder', status: 'Active', vaccinator: false }]
      }
    ] : [])
  ]
}

const isGroupAdminUser = (user) => {
  return (user?.organisations || []).some((organisation) => {
    return organisation.permissionLevel === 'Group administrator' && organisation.status !== 'Deactivated'
  })
}

const renderAddUserSelectionPage = (res, organisation, users, userIdError) => {
  res.render('pharmacies/add-user', {
    users,
    organisation,
    userIdError
  })
}

const renderAddUserPermissionLevelPage = (res, organisation, existingUser, errors = {}) => {
  res.render('pharmacies/add-user-permission-level', {
    organisation,
    existingUser,
    ...errors
  })
}

module.exports = router => {

  router.get('/pharmacies', (req, res) => {
    const perPage = 50
    const requestedPage = parseInt(req.query.page, 10) || 1
    const data = req.session.data
    const added = req.query.added
    const deleted = req.query.deleted === 'true'
    const deletedName = req.query.deletedName || ''
    const deletedId = req.query.deletedId || ''

    const companyId = res.locals.currentOrganisation.id

    const allOrganisations = data.organisations.filter((organisation) => organisation.companyId === companyId).sort(sortByNameThenPostcode())
    
    // Separate active/deactivated pharmacies from closed ones
    const activeOrganisations = allOrganisations.filter((org) => org.status !== 'Closed')
    const closedOrganisations = allOrganisations.filter((org) => org.status === 'Closed')
    const totalOrganisations = activeOrganisations.length
    const totalPages = Math.max(1, Math.ceil(totalOrganisations / perPage))
    const page = Math.min(Math.max(requestedPage, 1), totalPages)
    const indexStartFrom = (page - 1) * perPage
    const organisations = activeOrganisations.slice(indexStartFrom, indexStartFrom + perPage)

    let organisationUserCounts = {}

    for (const organisation of allOrganisations) {
      organisationUserCounts[organisation.id] = data.users
        .filter((user) => (user.organisations || [])
          .find((orgPermission) => orgPermission.id === organisation.id)
        ).length
    }


    res.render('pharmacies/index', {
      organisations,
      closedOrganisations,
      organisationUserCounts,
      page,
      totalOrganisations,
      totalPages,
      added,
      deleted,
      deletedName,
      deletedId
    })
  })

  router.get('/pharmacies/select', async (req, res) => {

    let pharmacies = await getPharmaciesBelongingToOrganisation("P15J")

    pharmacies = pharmacies.sort(sortByNameThenPostcode((item) => item.address.postcode))

    res.render('pharmacies/select', {
      pharmacies
    })
  })

  router.get('/pharmacies/check-selection', async (req, res) => {
    const data = req.session.data

    let pharmacies = await getPharmaciesBelongingToOrganisation("P15J")

    pharmacies = pharmacies.filter((pharmacy) => {
      return data.pharmacyIds.includes(pharmacy.id)
    }).sort(sortByNameThenPostcode())


    res.render('pharmacies/check-selection', {
      pharmacies
    })
  })

  router.post('/pharmacies/check-selection/remove', (req, res) => {
    const data = req.session.data
    const pharmacyIdToRemove = req.body.pharmacyIdToRemove

    if (pharmacyIdToRemove) {
      const ids = Array.isArray(data.pharmacyIds) ? data.pharmacyIds : [data.pharmacyIds].filter(Boolean)
      data.pharmacyIds = ids.filter((id) => id !== pharmacyIdToRemove)
    }

    res.redirect('/pharmacies/check-selection')
  })

  // Actually add the pharmacies
  router.post('/pharmacies/added', async (req, res) => {
    const data = req.session.data

    const companyId = res.locals.currentOrganisation.id

    let pharmacies = await getPharmaciesBelongingToOrganisation("P15J")

    pharmacies = pharmacies.filter((pharmacy) => {
      return data.pharmacyIds.includes(pharmacy.id)
    }).sort(sortByNameThenPostcode())

    for (const pharmacy of pharmacies) {

      data.organisations.push({
        id: pharmacy.id,
        name: pharmacy.name,
        type: 'Community Pharmacy',
        companyId: companyId,
        address: pharmacy.address,
        status: 'Active',
        addedByUser: true,
        vaccines: [
          {name: 'flu', status: 'enabled'}
        ],
        sites: [
          {
            id: pharmacy.id,
            name: pharmacy.name
          }
        ]
      })
    }

    res.redirect(`/pharmacies?added=${pharmacies.length}`)
  })

  router.get('/pharmacies/users',(req, res) => {
    const data = req.session.data
    const companyId = res.locals.currentOrganisation.id
    const deactivatedGroupAdminId = req.query.deactivatedGroupAdminId
    const deactivatedUserId = req.query.deactivatedUserId
    const deactivatedFromPharmacyId = req.query.deactivatedFromPharmacyId
    const deactivatedFromAllUserId = req.query.deactivatedFromAllUserId
    const deactivatedFromAllCount = parseInt(req.query.deactivatedFromAllCount, 10) || 0
    const pharmacies = data.organisations.filter((organisation) => organisation.companyId === companyId)

    const pharmacyIds = pharmacies.map(pharmacy => pharmacy.id)

    let users = data.users.sort(byName)

    users = users.filter(function(user) {
      // Get the IDs of all the organisations they have access to
      const userOrganisationIds = (user.organisations || []).map((organisation) => organisation.id)

      // See whether any of those organisations are the pharmacies in
      // this chain, or the head office company id
      return userOrganisationIds.some(id => pharmacyIds.includes(id) || id === companyId)
    })

    const groupAdministrators = users.filter(function(user) {
      return user.organisations.find(org => org.permissionLevel === "Group administrator" && org.status !== 'Deactivated')
    })

    const deactivatedGroupAdmin = deactivatedGroupAdminId
      ? data.users.find((user) => user.id === deactivatedGroupAdminId)
      : undefined

    const deactivatedUser = deactivatedUserId
      ? data.users.find((user) => user.id === deactivatedUserId)
      : undefined

    const deactivatedFromPharmacy = deactivatedFromPharmacyId
      ? data.organisations.find((organisation) => organisation.id === deactivatedFromPharmacyId)
      : undefined

    const deactivatedFromAllUser = deactivatedFromAllUserId
      ? data.users.find((user) => user.id === deactivatedFromAllUserId)
      : undefined

    // Show only active users added to individual pharmacies in the general user list.
    users = users.filter((user) => {
      if (groupAdministrators.includes(user)) {
        return false
      }

      return (user.organisations || []).some((organisation) => {
        return pharmacyIds.includes(organisation.id) && organisation.status !== 'Deactivated'
      })
    })

    const userPharmacyCounts = {}

    for (const user of users) {
      userPharmacyCounts[user.id] = (user.organisations || []).filter((organisation) => {
        return pharmacyIds.includes(organisation.id) && organisation.status !== 'Deactivated'
      }).length
    }

    res.render('pharmacies/users/index', {
      users,
      groupAdministrators,
      deactivatedGroupAdmin,
      deactivatedUser,
      deactivatedFromPharmacy,
      deactivatedFromAllUser,
      deactivatedFromAllCount,
      userPharmacyCounts
    })
  })

  router.get('/pharmacies/:groupId/users/:userId/deactivate-from-group',(req, res) => {
    const data = req.session.data
    const groupId = req.params.groupId
    const userId = req.params.userId

    const user = data.users.find((item) => item.id === userId)

    if (!user) {
      return res.redirect('/pharmacies/users')
    }

    const groupRole = (user.organisations || []).find((org) => org.id === groupId && org.permissionLevel === 'Group administrator')

    if (!groupRole) {
      return res.redirect('/pharmacies/users')
    }

    res.render('pharmacies/users/deactivate-from-group', {
      user,
      groupId,
      groupName: (res.locals.currentOrganisation && res.locals.currentOrganisation.name) || 'this pharmacy group'
    })
  })

  router.post('/pharmacies/:groupId/users/:userId/deactivate-from-group-answer',(req, res) => {
    const data = req.session.data
    const groupId = req.params.groupId
    const userId = req.params.userId

    const user = data.users.find((item) => item.id === userId)

    if (!user) {
      return res.redirect('/pharmacies/users')
    }

    const groupRole = (user.organisations || []).find((org) => org.id === groupId && org.permissionLevel === 'Group administrator')

    if (!groupRole) {
      return res.redirect('/pharmacies/users')
    }

    groupRole.status = 'Deactivated'

    res.redirect(`/pharmacies/users?deactivatedGroupAdminId=${user.id}`)
  })

  router.get('/pharmacies/users/new',(req, res) => {

    res.render('pharmacies/users/new')
  })

  router.post('/pharmacies/users/new-answer',(req, res) => {
    const data = req.session.data
    const groupAdministrator = data.groupAdministrator
    const firstName = (data.firstName || '').trim()
    const lastName = (data.lastName || '').trim()
    const email = (data.email || '').trim()
    const existingUserWithSameEmail = email
      ? data.users.find((user) => user.email.toLowerCase() === email.toLowerCase())
      : null

    let firstNameError
    let lastNameError
    let emailError

    if (!firstName) {
      firstNameError = 'Enter a first name'
    }

    if (!lastName) {
      lastNameError = 'Enter a last name'
    }

    if (!email) {
      emailError = 'Enter an email address'
    } else if (!(email.toLowerCase().endsWith('nhs.net') || email.toLowerCase().endsWith('.nhs.uk'))) {
      emailError = 'Enter an allowed email address'
    } else if (groupAdministrator === 'no' && existingUserWithSameEmail && isGroupAdminUser(existingUserWithSameEmail)) {
      emailError = 'You cannot add a group administrator to an individual pharmacy'
    }

    data.firstName = firstName
    data.lastName = lastName
    data.email = email

    if (firstNameError || lastNameError || emailError) {
      return res.render('pharmacies/users/new', {
        firstNameError,
        lastNameError,
        emailError
      })
    }

    if (groupAdministrator === "yes") {
      res.redirect('/pharmacies/users/check')
    } else {
      res.redirect('/pharmacies/users/new-select-pharmacies')
    }
  })

  router.get('/pharmacies/users/new-select-pharmacies',(req, res) => {
    const data = req.session.data
    const companyId = res.locals.currentOrganisation.id
    const pharmacies = data.organisations.filter((organisation) => organisation.companyId === companyId)

    res.render('pharmacies/users/new-select-pharmacies', {
      pharmacies
    })
  })

  router.get('/pharmacies/users/new-select-pharmacies-check',(req, res) => {
    const data = req.session.data
    const pharmacyIds = data.pharmacyIds || []

    if (pharmacyIds.length === 0) {
      return res.redirect('/pharmacies/users/new-select-pharmacies')
    }

    if (pharmacyIds.length === 1) {
      return res.redirect('/pharmacies/users/new-permission-level')
    }

    // Get pharmacies selected on previous page
    const pharmacies = data.organisations.filter((organisation) => pharmacyIds.includes(organisation.id))


    res.render('pharmacies/users/new-select-pharmacies-check', {
      pharmacies
    })
  })

  router.get('/pharmacies/users/new-select-pharmacies-check/remove/:pharmacyId', (req, res) => {
    const data = req.session.data
    const pharmacyId = req.params.pharmacyId
    const pharmacyIds = Array.isArray(data.pharmacyIds)
      ? data.pharmacyIds
      : (data.pharmacyIds ? [data.pharmacyIds] : [])

    data.pharmacyIds = pharmacyIds.filter((id) => id !== pharmacyId)

    if (data.pharmacyIds.length === 0) {
      return res.redirect('/pharmacies/users/new-select-pharmacies')
    }

    res.redirect('/pharmacies/users/new-select-pharmacies-check')
  })

  router.get('/pharmacies/users/new-permission-level',(req, res) => {
    const data = req.session.data
    const pharmacyIds = data.pharmacyIds || []

    // Get pharmacies selected on previous page
    const pharmacies = data.organisations.filter((organisation) => pharmacyIds.includes(organisation.id))


    res.render('pharmacies/users/new-permission-level', {
      pharmacies
    })
  })

  router.get('/pharmacies/add-lead-admins',(req, res) => {
    const data = req.session.data
    const users = data.users.slice(10, 20)

    res.render('pharmacies/add-lead-admins', {
      users
    })
  })

  router.get('/pharmacies/users/check',(req, res) => {
    const data = req.session.data
    const pharmacyIds = data.pharmacyIds || []

    // Get pharmacies selected on previous page
    const pharmacies = data.organisations.filter((organisation) => pharmacyIds.includes(organisation.id))

    res.render('pharmacies/users/check', {
      pharmacies
    })


  })

  router.post('/pharmacies/users/check-answer',(req, res) => {
    const data = req.session.data
    const groupAdministrator = data.groupAdministrator
    const pharmacyIds = data.pharmacyIds || []

    const user = {
      id: Math.floor(Math.random() * 10000000).toString(),
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      organisations: []
    }

    if (groupAdministrator === "yes") {
      user.organisations.push({
        id: res.locals.currentOrganisation.id,
        status: 'Invited',
        permissionLevel: "Group administrator"
      })
    }

    if (pharmacyIds.length > 0) {

      for (const pharmacyId of pharmacyIds) {

        user.organisations.push({
          id: pharmacyId,
          status: 'Invited',
          permissionLevel: data.permissionLevel,
          vaccinator: data.vaccinator
        })
      }

    }

    data.users.push(user)

    // Reset answers
    data.firstName = ''
    data.lastName = ''
    data.email = ''
    data.permissionLevel = ''

    res.redirect('/pharmacies/users?added=true')
  })

  router.get('/pharmacies/:id/view-as', (req, res) => {
    const data = req.session.data
    const id = req.params.id
    const organisation = data.organisations.find(o => o.id === id)

    if (!organisation || organisation.status === 'Deactivated') {
      return res.redirect(`/pharmacies/${id}`)
    }

    req.session.data.previousOrganisationId = req.session.data.currentOrganisationId
    req.session.data.currentOrganisationId = id

    const landingPath = organisation.appointmentsInterfaceEnabled !== false
      ? '/appointments'
      : '/record-vaccinations'

    res.redirect(landingPath)
  })

  router.get('/pharmacies/:id/deactivate',(req, res) => {
    const data = req.session.data
    const id = req.params.id
    const pharmacy = data.organisations.find(organisation => organisation.id === id)

    if (hasVaccinationRecords(data, id) === false) {
      return res.redirect(`/pharmacies/${id}/delete`)
    }

    res.render('pharmacies/deactivate', {
      pharmacy
    })
  })

  router.get('/pharmacies/:id/delete', (req, res) => {
    const data = req.session.data
    const id = req.params.id
    const pharmacy = data.organisations.find((organisation) => organisation.id === id)

    if (!pharmacy) {
      return res.redirect('/pharmacies')
    }

    if (hasVaccinationRecords(data, id)) {
      return res.redirect(`/pharmacies/${id}`)
    }

    res.render('pharmacies/delete', {
      pharmacy
    })
  })

  router.post('/pharmacies/:id/delete-answer', (req, res) => {
    const data = req.session.data
    const id = req.params.id
    const pharmacy = data.organisations.find((organisation) => organisation.id === id)

    if (!pharmacy) {
      return res.redirect('/pharmacies')
    }

    if (hasVaccinationRecords(data, id)) {
      return res.redirect(`/pharmacies/${id}`)
    }

    const pharmacyName = pharmacy.name
    const pharmacyId = pharmacy.id
    data.organisations = data.organisations.filter((organisation) => organisation.id !== id)

    return res.redirect(`/pharmacies?deleted=true&deletedName=${encodeURIComponent(pharmacyName)}&deletedId=${encodeURIComponent(pharmacyId)}`)
  })

  router.post('/pharmacies/:id/deactivate-answer',(req, res) => {
    const data = req.session.data
    const id = req.params.id
    const pharmacy = data.organisations.find(organisation => organisation.id === id)

    pharmacy.status = 'Deactivated'

    res.redirect(`/pharmacies/${id}?deactivated=true`)
  })

  router.get('/pharmacies/:id/add-user',(req, res) => {
    const data = req.session.data
    const users = data.users.slice(10, 30)
    const id = req.params.id
    const organisation = data.organisations.find((organisation) => organisation.id === id)

    renderAddUserSelectionPage(res, organisation, users)
  })

  router.post('/pharmacies/:id/add-user-permission-level', (req, res) => {
    const data = req.session.data
    const users = data.users.slice(10, 30)
    const id = req.params.id
    const organisation = data.organisations.find((item) => item.id === id)
    const selectedUserId = req.body.userId || data.userId
    const selectedUser = selectedUserId && selectedUserId !== 'add-new'
      ? data.users.find((user) => user.id === selectedUserId)
      : null

    if (selectedUser && isGroupAdminUser(selectedUser)) {
      return renderAddUserSelectionPage(
        res,
        organisation,
        users,
        'You cannot add a group administrator to an individual pharmacy'
      )
    }

    res.redirect(`/pharmacies/${id}/add-user-permission-level`)
  })

  router.get('/pharmacies/:id/add-user-permission-level',(req, res) => {
    const data = req.session.data
    const id = req.params.id
    const organisation = data.organisations.find((organisation) => organisation.id === id)
    let existingUser

    if (data.userId) {
      existingUser = data.users.find((user) => user.id === data.userId)
    }

    renderAddUserPermissionLevelPage(res, organisation, existingUser)
  })

  router.post('/pharmacies/:id/add-user-check', (req, res) => {
    const data = req.session.data
    const id = req.params.id
    const organisation = data.organisations.find((item) => item.id === id)
    const selectedUserId = req.body.userId || data.userId
    const submittedFirstName = req.body.firstName || data.firstName
    const submittedLastName = req.body.lastName || data.lastName
    const submittedEmail = (req.body.email || data.email || '').trim()
    const submittedPermissionLevel = req.body.permissionLevel || data.permissionLevel
    const submittedVaccinator = req.body.vaccinator || data.vaccinator
    const existingUser = selectedUserId ? data.users.find((user) => user.id === selectedUserId) : null
    const existingUserWithSameEmail = submittedEmail
      ? data.users.find((user) => user.email.toLowerCase() === submittedEmail.toLowerCase())
      : null

    let firstNameError
    let lastNameError
    let emailError
    let permissionLevelError
    let vaccinatorError

    if (!existingUser) {
      if (!submittedFirstName || submittedFirstName === '') {
        firstNameError = 'Enter a first name'
      }

      if (!submittedLastName || submittedLastName === '') {
        lastNameError = 'Enter a last name'
      }

      if (!submittedEmail || submittedEmail === '') {
        emailError = 'Enter an email address'
      } else if (!(submittedEmail.toLowerCase().endsWith('nhs.net') || submittedEmail.toLowerCase().endsWith('.nhs.uk'))) {
        emailError = 'Enter an allowed email address'
      } else if (existingUserWithSameEmail && isGroupAdminUser(existingUserWithSameEmail)) {
        emailError = 'You cannot add a group administrator to an individual pharmacy'
      }
    }

    if (!submittedPermissionLevel || submittedPermissionLevel === '') {
      permissionLevelError = 'Select a permission level'
    }

    if (!submittedVaccinator || submittedVaccinator === '') {
      vaccinatorError = 'Select if they’re a vaccinator'
    }

    if (firstNameError || lastNameError || emailError || permissionLevelError || vaccinatorError) {
      return renderAddUserPermissionLevelPage(res, organisation, existingUser, {
        firstNameError,
        lastNameError,
        emailError,
        permissionLevelError,
        vaccinatorError
      })
    }

    res.redirect(`/pharmacies/${id}/add-user-check`)
  })

  router.get('/pharmacies/:id/add-user-check',(req, res) => {
    const data = req.session.data
    const id = req.params.id
    const organisation = data.organisations.find((organisation) => organisation.id === id)
    let existingUser

    if (data.userId) {
      existingUser = data.users.find((user) => user.id === data.userId)
    }

    res.render('pharmacies/add-user-check', {
      organisation,
      existingUser
    })
  })

  router.post('/pharmacies/:id/user-added',(req, res) => {
    const data = req.session.data
    const id = req.params.id
    const organisation = data.organisations.find((organisation) => organisation.id === id)
    const selectedUserId = req.body.userId || data.userId
    const submittedEmail = (req.body.email || data.email || '').trim()
    const existingUser = selectedUserId ? data.users.find((user) => user.id === selectedUserId) : null
    const existingUserWithSameEmail = submittedEmail
      ? data.users.find((user) => user.email.toLowerCase() === submittedEmail.toLowerCase())
      : null
    let addedUserId

    if ((existingUser && isGroupAdminUser(existingUser)) || (!existingUser && existingUserWithSameEmail && isGroupAdminUser(existingUserWithSameEmail))) {
      return renderAddUserPermissionLevelPage(res, organisation, existingUser, {
        emailError: 'You cannot add a group administrator to an individual pharmacy'
      })
    }

    if (existingUser) {

      existingUser.organisations ||= []
      existingUser.organisations.push({
        id: organisation.id,
        status: 'Active',
        vaccinator: (data.vaccinator === 'yes'),
        permissionLevel: data.permissionLevel,
        inviteSent: new Date().toISOString()
      })

      addedUserId = existingUser.id
    } else {

      const newUserId = Math.floor(Math.random() * 10000000).toString()

      data.users.push({
        id: newUserId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        organisations: [
          {
            id: organisation.id,
            status: 'Invited',
            vaccinator: (data.vaccinator === 'yes'),
            permissionLevel: data.permissionLevel,
            inviteSent: new Date().toISOString()
          }
        ]
      })

      addedUserId = newUserId

    }

    // Reset data
    req.session.data.userId = ''
    req.session.data.email = ''
    req.session.data.firstName = ''
    req.session.data.lastName = ''
    req.session.data.permissionLevel = ''
    req.session.data.vaccinator = ''

    res.redirect(`/pharmacies/${organisation.id}?added=true&addedUserId=${addedUserId}&tab=${existingUser ? 'active' : 'invited'}`)
  })


  router.get('/pharmacies/:pharmacyId/users/:userId/change',(req, res) => {
    const data = req.session.data
    const pharmacyId = req.params.pharmacyId
    const userId = req.params.userId

    const user = data.users.find(user => user.id === userId)
    const pharmacy = data.organisations.find(organisation => organisation.id === pharmacyId)

    const role = user.organisations.find(userOrg => userOrg.id === pharmacyId)

    res.render('pharmacies/users/change-user-role', {
      user,
      pharmacy,
      role
    })
  })

  router.get('/pharmacies/:pharmacyId/users/:userId/deactivate-from-pharmacy',(req, res) => {
    const data = req.session.data
    const pharmacyId = req.params.pharmacyId
    const userId = req.params.userId
    const from = req.query.from === 'pharmacy' ? 'pharmacy' : 'user'

    const user = data.users.find(user => user.id === userId)
    const pharmacy = data.organisations.find(organisation => organisation.id === pharmacyId)

    res.render('pharmacies/users/deactivate-from-pharmacy', {
      user,
      pharmacy,
      from
    })
  })

  router.post('/pharmacies/:pharmacyId/users/:userId/deactivate-from-pharmacy-answer',(req, res) => {
    const data = req.session.data
    const pharmacyId = req.params.pharmacyId
    const userId = req.params.userId
    const from = req.query.from === 'pharmacy' ? 'pharmacy' : 'user'
    const deactivatedByName = res.locals.currentUser
      ? `${res.locals.currentUser.firstName} ${res.locals.currentUser.lastName}`
      : 'User'

    const user = data.users.find(user => user.id === userId)
    const pharmacy = data.organisations.find(organisation => organisation.id === pharmacyId)

    const role = user.organisations.find(role => role.id === pharmacyId)

    role.status = 'Deactivated'
    role.deactivatedBy = deactivatedByName
    role.deactivatedDate = new Date().toISOString().split('T')[0]

    if (from === 'user') {
      return res.redirect(`/pharmacies/users/${user.id}?deactivatedFromPharmacyId=${pharmacy.id}`)
    }

    res.redirect(`/pharmacies/${pharmacy.id}?tab=deactivated&deactivatedUserId=${user.id}&deactivatedFromPharmacyId=${pharmacy.id}`)

  })

  router.get('/pharmacies/:pharmacyId/users/:userId/resend-invite', (req, res) => {
    const data = req.session.data
    const pharmacyId = req.params.pharmacyId
    const userId = req.params.userId

    const pharmacy = data.organisations.find((organisation) => organisation.id === pharmacyId)

    if (!pharmacy) {
      return res.redirect('/pharmacies')
    }

    let user = data.users.find((item) => item.id === userId)

    // Pre-seeded users are generated at render time; look them up if not in session
    if (!user) {
      const seededUser = buildDefaultScenarioUsersForPharmacy(pharmacy)
        .find((item) => item.id === userId)

      if (seededUser) {
        user = JSON.parse(JSON.stringify(seededUser))
        data.users.push(user)
      }
    }

    if (!user) {
      return res.redirect(`/pharmacies/${pharmacyId}?tab=invited`)
    }

    res.render('pharmacies/users/resend-invite', {
      user,
      pharmacy
    })
  })

  router.post('/pharmacies/:pharmacyId/users/:userId/resend-invite-answer', (req, res) => {
    const data = req.session.data
    const pharmacyId = req.params.pharmacyId
    const userId = req.params.userId

    const user = data.users.find((item) => item.id === userId)
    const pharmacy = data.organisations.find((organisation) => organisation.id === pharmacyId)

    if (!user || !pharmacy) {
      return res.redirect('/pharmacies')
    }

    const role = (user.organisations || []).find((item) => item.id === pharmacyId)

    if (!role) {
      return res.redirect(`/pharmacies/${pharmacyId}?tab=invited`)
    }

    role.inviteSent = new Date().toISOString()

    res.redirect(`/pharmacies/${pharmacyId}?tab=invited`)
  })

  router.get('/pharmacies/:pharmacyId/users/:userId/reactivate', (req, res) => {
    const data = req.session.data
    const pharmacyId = req.params.pharmacyId
    const userId = req.params.userId

    const pharmacy = data.organisations.find((organisation) => organisation.id === pharmacyId)

    if (!pharmacy) {
      return res.redirect('/pharmacies')
    }

    let user = data.users.find((item) => item.id === userId)

    // Pre-seeded scenario users are generated at render time; persist them
    // into session state before reactivation so status changes are retained.
    if (!user) {
      const seededUser = buildDefaultScenarioUsersForPharmacy(pharmacy)
        .find((item) => item.id === userId)

      if (seededUser) {
        user = JSON.parse(JSON.stringify(seededUser))
        data.users.push(user)
      }
    }

    if (!user) {
      return res.redirect(`/pharmacies/${pharmacyId}?tab=deactivated`)
    }

    const role = (user.organisations || []).find((item) => item.id === pharmacyId)

    if (!role) {
      return res.redirect(`/pharmacies/${pharmacyId}?tab=deactivated`)
    }

    role.status = 'Active'
    if (!user.lastLogIn) {
      user.lastLogIn = new Date().toISOString().split('T')[0]
    }

    res.redirect(`/pharmacies/${pharmacyId}?tab=active&reactivatedUserId=${userId}&reactivatedFromPharmacyId=${pharmacyId}`)
  })

  router.get('/pharmacies/users/:userId/deactivate-from-all-pharmacies', (req, res) => {
    const data = req.session.data
    const userId = req.params.userId
    const companyId = res.locals.currentOrganisation.id

    const user = data.users.find((item) => item.id === userId)

    if (!user) {
      return res.redirect('/pharmacies/users')
    }

    const activePharmacyRolesAtCompany = (user.organisations || [])
      .map((role) => {
        const pharmacy = data.organisations.find((organisation) => organisation.id === role.id)
        return { role, pharmacy }
      })
      .filter(({ role, pharmacy }) => pharmacy && pharmacy.companyId === companyId && role.permissionLevel !== 'Group administrator' && role.status !== 'Deactivated')

    if (activePharmacyRolesAtCompany.length === 0) {
      return res.redirect(`/pharmacies/users/${userId}`)
    }

    res.render('pharmacies/users/deactivate-from-all-pharmacies', {
      user,
      pharmacies: activePharmacyRolesAtCompany.map(({ pharmacy }) => pharmacy)
    })
  })

  router.post('/pharmacies/users/:userId/deactivate-from-all-pharmacies-answer', (req, res) => {
    const data = req.session.data
    const userId = req.params.userId
    const companyId = res.locals.currentOrganisation.id
    const deactivatedByName = res.locals.currentUser
      ? `${res.locals.currentUser.firstName} ${res.locals.currentUser.lastName}`
      : 'User'

    const user = data.users.find((item) => item.id === userId)

    if (!user) {
      return res.redirect('/pharmacies/users')
    }

    const deactivatedPharmacyIds = []

    for (const role of (user.organisations || [])) {
      const pharmacy = data.organisations.find((organisation) => organisation.id === role.id)

      if (pharmacy && pharmacy.companyId === companyId && role.permissionLevel !== 'Group administrator' && role.status !== 'Deactivated') {
        role.status = 'Deactivated'
        role.deactivatedBy = deactivatedByName
        role.deactivatedDate = new Date().toISOString().split('T')[0]
        deactivatedPharmacyIds.push(pharmacy.id)
      }
    }

    res.redirect(`/pharmacies/users?deactivatedFromAllUserId=${userId}&deactivatedFromAllCount=${deactivatedPharmacyIds.length}`)
  })


  router.post('/pharmacies/:pharmacyId/users/:userId/change-answer',(req, res) => {
    const data = req.session.data
    const pharmacyId = req.params.pharmacyId
    const userId = req.params.userId
    const from = data.from

    const user = data.users.find(user => user.id === userId)
    const pharmacy = data.organisations.find(organisation => organisation.id === pharmacyId)

    const role = user.organisations.find(userOrg => userOrg.id === pharmacyId)

    role.permissionLevel = data.permissionLevel
    role.vaccinator = (data.vaccinator === "yes")

    if (from === "user") {
      res.redirect(`/pharmacies/users/${user.id}`)
    } else {
      res.redirect(`/pharmacies/${pharmacy.id}`)
    }

  })

  router.get('/pharmacies/users/:id/add-to',(req, res) => {
    const data = req.session.data
    const userId = req.params.id
    const user = data.users.find(user => user.id === userId)
    const companyId = res.locals.currentOrganisation.id

    const pharmacyIdsThatUserAlreadyHasAccessTo = user.organisations.map(organisation => organisation.id)

    const pharmacies = data.organisations.filter((organisation) => (organisation.companyId === companyId) && !pharmacyIdsThatUserAlreadyHasAccessTo.includes(organisation.id))


    res.render('pharmacies/users/add-to', {
      user,
      pharmacies
    })
  })

  router.get('/pharmacies/users/:id/add-to-select-pharmacies-check', (req, res) => {
    const data = req.session.data
    const userId = req.params.id
    const user = data.users.find(user => user.id === userId)

    const selectedPharmacyIds = data.addToPharmacyIds
      ? (Array.isArray(data.addToPharmacyIds) ? data.addToPharmacyIds : [data.addToPharmacyIds])
      : []

    if (selectedPharmacyIds.length === 0) {
      return res.redirect(`/pharmacies/users/${userId}/add-to`)
    }

    if (selectedPharmacyIds.length === 1) {
      return res.redirect(`/pharmacies/users/${userId}/add-to-permission-level`)
    }

    const pharmacies = data.organisations.filter((organisation) => selectedPharmacyIds.includes(organisation.id))

    res.render('pharmacies/users/add-to-select-pharmacies-check', {
      user,
      pharmacies
    })
  })

  router.get('/pharmacies/users/:id/add-to-select-pharmacies-check/remove/:pharmacyId', (req, res) => {
    const data = req.session.data
    const userId = req.params.id
    const pharmacyId = req.params.pharmacyId

    const selectedPharmacyIds = data.addToPharmacyIds
      ? (Array.isArray(data.addToPharmacyIds) ? data.addToPharmacyIds : [data.addToPharmacyIds])
      : []

    data.addToPharmacyIds = selectedPharmacyIds.filter((id) => id !== pharmacyId)

    if (data.addToPharmacyIds.length === 0) {
      return res.redirect(`/pharmacies/users/${userId}/add-to`)
    }

    res.redirect(`/pharmacies/users/${userId}/add-to-select-pharmacies-check`)
  })

  router.get('/pharmacies/users/:id/add-to-permission-level',(req, res) => {
    const data = req.session.data
    const userId = req.params.id
    const user = data.users.find(user => user.id === userId)

    const selectedPharmacyIds = data.addToPharmacyIds
      ? (Array.isArray(data.addToPharmacyIds) ? data.addToPharmacyIds : [data.addToPharmacyIds])
      : []
    const pharmacies = data.organisations.filter((organisation) => selectedPharmacyIds.includes(organisation.id))

    if (pharmacies.length === 0) {
      return res.redirect(`/pharmacies/users/${userId}/add-to`)
    }

    res.render('pharmacies/users/add-to-permission-level', {
      user,
      pharmacies
    })
  })

  router.get('/pharmacies/users/:id/add-to-check',(req, res) => {
    const data = req.session.data
    const userId = req.params.id
    const user = data.users.find(user => user.id === userId)

    const selectedPharmacyIds = data.addToPharmacyIds
      ? (Array.isArray(data.addToPharmacyIds) ? data.addToPharmacyIds : [data.addToPharmacyIds])
      : []
    const pharmacies = data.organisations.filter((organisation) => selectedPharmacyIds.includes(organisation.id))

    if (pharmacies.length === 0) {
      return res.redirect(`/pharmacies/users/${userId}/add-to`)
    }

    res.render('pharmacies/users/add-to-check', {
      user,
      pharmacies
    })
  })

  router.post('/pharmacies/users/:id/add-to-check-answer',(req, res) => {
    const data = req.session.data
    const id = req.params.id
    const user = data.users.find(user => user.id === id)

    const selectedPharmacyIds = data.addToPharmacyIds
      ? (Array.isArray(data.addToPharmacyIds) ? data.addToPharmacyIds : [data.addToPharmacyIds])
      : []
    const pharmacies = data.organisations.filter((organisation) => selectedPharmacyIds.includes(organisation.id))

    if (pharmacies.length === 0) {
      return res.redirect(`/pharmacies/users/${id}/add-to`)
    }

    const existingOrganisationIds = (user.organisations || []).map(organisation => organisation.id)

    const addedPharmacyIds = []

    for (const pharmacy of pharmacies) {
      if (!existingOrganisationIds.includes(pharmacy.id)) {
        user.organisations.push({
          id: pharmacy.id,
          status: 'Active',
          permissionLevel: data.permissionLevel,
          vaccinator: (data.vaccinator === 'yes')
        })
        addedPharmacyIds.push(pharmacy.id)
      }
    }

    // Reset answers
    data.permissionLevel = ''
    data.vaccinator = ''
    data.addToPharmacyIds = []

    if (addedPharmacyIds.length === 0) {
      return res.redirect(`/pharmacies/users/${id}`)
    }

    if (addedPharmacyIds.length > 1) {
      res.redirect(`/pharmacies/users/${id}?addedToPharmacyIds=${addedPharmacyIds.join(',')}`)
    } else {
      res.redirect(`/pharmacies/users/${id}?addedToPharmacyId=${addedPharmacyIds[0]}`)
    }
  })

  router.get('/pharmacies/:id/edit-vaccines', (req, res) => {
    const data = req.session.data
    const { id } = req.params
    const organisation = data.organisations.find((org) => org.id === id)

    if (!organisation) {
      return res.redirect('/pharmacies')
    }

    const enabledVaccineNames = (organisation.vaccines || [])
      .filter((vaccine) => vaccine.status === 'enabled')
      .map((vaccine) => vaccine.name)

    res.render('pharmacies/edit-vaccines', {
      organisation,
      allVaccines: data.vaccines || [],
      enabledVaccineNames
    })
  })

  router.post('/pharmacies/:id/update-vaccines', (req, res) => {
    const data = req.session.data
    const { id } = req.params
    const organisation = data.organisations.find((org) => org.id === id)

    if (!organisation) {
      return res.redirect('/pharmacies')
    }

    const selectedVaccinesRaw = req.body.vaccinesEnabled
    const selectedVaccines = Array.isArray(selectedVaccinesRaw)
      ? selectedVaccinesRaw
      : (selectedVaccinesRaw ? [selectedVaccinesRaw] : [])

    organisation.vaccines ||= []
    const allVaccineNames = (data.vaccines || []).map((vaccine) => vaccine.name)

    for (const vaccineName of allVaccineNames) {
      const existingVaccine = organisation.vaccines.find((vaccine) => vaccine.name === vaccineName)
      const isSelected = selectedVaccines.includes(vaccineName)

      if (existingVaccine) {
        existingVaccine.status = isSelected ? 'enabled' : 'disabled'
      } else if (isSelected) {
        organisation.vaccines.push({
          name: vaccineName,
          status: 'enabled'
        })
      }
    }

    return res.redirect(`/pharmacies/${id}?vaccinesUpdated=true`)
  })


  router.get('/pharmacies/:id', async (req, res) => {
    const data = req.session.data
    const id = req.params.id
    const added = req.query.added
    const addedUserId = req.query.addedUserId
    const deactivated = req.query.deactivated
    const deactivatedUserId = req.query.deactivatedUserId
    const deactivatedFromPharmacyId = req.query.deactivatedFromPharmacyId
    const reactivatedUserId = req.query.reactivatedUserId
    const reactivatedFromPharmacyId = req.query.reactivatedFromPharmacyId
    const vaccinesUpdated = req.query.vaccinesUpdated
    const tab = (req.query.tab || 'active').toLowerCase()


    const organisation = data.organisations.find((organisation) => organisation.id === id)

    if (organisation && (!organisation.address?.line1 || !organisation.address?.town)) {
      try {
        const organisationWithFullAddress = await getOrganisation(id)
        if (organisationWithFullAddress && organisationWithFullAddress.address) {
          organisation.address = {
            ...organisation.address,
            ...organisationWithFullAddress.address
          }
        }
      } catch {
        // Keep existing address when the FHIR lookup is unavailable.
      }
    }

    const addedUser = data.users.find((user) => user.id === addedUserId)
    const deactivatedUser = data.users.find((user) => user.id === deactivatedUserId)
    const reactivatedUser = data.users.find((user) => user.id === reactivatedUserId)
    const canDeletePharmacy = !hasVaccinationRecords(data, id)

    const userOrganisationPermissions = {}

    const defaultScenarioUsers = buildDefaultScenarioUsersForPharmacy(organisation)
    const existingUserIds = new Set((data.users || []).map((user) => user.id))
    const users = organisation.addedByUser
      ? data.users
      : [...data.users, ...defaultScenarioUsers.filter((user) => !existingUserIds.has(user.id))]

    const usersForOrganisation = users.filter((user) => {
      if (data.previousOrganisationId && user.id === data.currentUserId) {
        return false
      }

      return (user.organisations || [])
        .find((orgPermission) => orgPermission.id === organisation.id)
    })

    const usersByStatus = {
      invited: [],
      active: [],
      deactivated: []
    }

    for (const user of usersForOrganisation) {
      userOrganisationPermissions[user.id] = user.organisations.find((userOrganisation) => userOrganisation.id === organisation.id)

      const userOrganisationStatus = userOrganisationPermissions[user.id].status

      if (userOrganisationStatus === 'Active' && !user.lastLogIn) {
        user.lastLogIn = new Date().toISOString().split('T')[0]
      }

      if (userOrganisationStatus === 'Invited') {
        usersByStatus.invited.push(user)
      } else if (userOrganisationStatus === 'Deactivated') {
        usersByStatus.deactivated.push(user)
      } else {
        usersByStatus.active.push(user)
      }
    }

    const validTabs = ['invited', 'active', 'deactivated']
    const currentTab = validTabs.includes(tab) ? tab : 'active'
    const usersForTab = usersByStatus[currentTab]

    res.render('pharmacies/pharmacy', {
      organisation,
      users: usersForTab,
      usersByStatus,
      currentTab,
      userOrganisationPermissions,
      added,
      addedUser,
      deactivated,
      deactivatedUser,
      deactivatedFromPharmacyId,
      reactivatedUser,
      reactivatedFromPharmacyId,
      vaccinesUpdated,
      canDeletePharmacy
    })
  })


  router.get('/pharmacies/users/:id',(req, res) => {
    const data = req.session.data
    const id = req.params.id
    const user = data.users.find((user) => user.id === id)
    const companyId = res.locals.currentOrganisation.id

    if (!user) {
      return res.redirect('/pharmacies/users')
    }

    const addedToPharmacyId = req.query.addedToPharmacyId
    const addedToPharmacyIds = req.query.addedToPharmacyIds
    const deactivatedFromPharmacyId = req.query.deactivatedFromPharmacyId
    const deactivatedFromAllPharmacies = req.query.deactivatedFromAllPharmacies === 'true'
    const deactivatedFromAllPharmacyIds = (req.query.deactivatedFromAllPharmacyIds || '').split(',').filter(Boolean)
    const deactivatedFromAllCount = deactivatedFromAllPharmacyIds.length

    let addedToPharmacy, addedToPharmacies, deactivatedFromPharmacy

    if (addedToPharmacyId) {
      addedToPharmacy = data.organisations.find(organisation => organisation.id === addedToPharmacyId)
    }
    if (addedToPharmacyIds) {
      const ids = addedToPharmacyIds.split(',').filter(Boolean)
      addedToPharmacies = data.organisations.filter((organisation) => ids.includes(organisation.id))
    }
    if (deactivatedFromPharmacyId) {
      deactivatedFromPharmacy = data.organisations.find(organisation => organisation.id === deactivatedFromPharmacyId)
    }

    const totalPharmaciesAtOrganisation = data.organisations.filter(organisation => organisation.companyId === companyId).length

    const pharmacyRoles = (user.organisations || [])
      .filter((role) => role.permissionLevel !== 'Group administrator')
      .filter((role) => role.status !== 'Deactivated')
      .map((role) => {
        const pharmacy = data.organisations.find((organisation) => organisation.id === role.id)

        return {
          ...role,
          pharmacy
        }
      })
      .filter((role) => role.pharmacy && role.pharmacy.companyId === companyId)

    res.render('pharmacies/users/manage-ind-user', {
      user,
      pharmacyRoles,
      addedToPharmacy,
      addedToPharmacies,
      deactivatedFromPharmacy,
      deactivatedFromAllPharmacies,
      deactivatedFromAllCount,
      totalPharmaciesAtOrganisation
    })
  })

}
