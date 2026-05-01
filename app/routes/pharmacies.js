const { getPharmaciesBelongingToOrganisation, getPharmacyChains, getOrganisation } = require('../lib/ods');

const sortByNameThenPostcode = (getPostcode = (item) => item.postcode) => (a, b) => {
  if (a.name < b.name) return -1
  if (a.name > b.name) return 1
  const postcodeA = getPostcode(a)
  const postcodeB = getPostcode(b)
  if (postcodeA < postcodeB) return -1
  return 1
}

module.exports = router => {

  router.get('/pharmacies', (req, res) => {
    const data = req.session.data
    const currentUser = res.locals.currentUser
    const added = req.query.added

    // TODO: get this from the current login
    // rather than hardcode it
    const companyId = 'P15951'

    const userOrganisationIds = currentUser.organisations.map((organisation) => organisation.id)

    const organisations = data.organisations.filter((organisation) => organisation.companyId === companyId).sort(sortByNameThenPostcode())

    let organisationUserCounts = {}

    for (const organisation of organisations) {
      organisationUserCounts[organisation.id] = data.users
        .filter((user) => (user.organisations || [])
          .find((orgPermission) => orgPermission.id === organisation.id)
        ).length
    }


    res.render('pharmacies/index', {
      organisations,
      organisationUserCounts,
      added
    })
  })

  router.get('/pharmacies/select', async (req, res) => {
    const data = req.session.data
    const id = req.params.id

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

  // Actually add the pharmacies
  router.post('/pharmacies/added', async (req, res) => {
    const data = req.session.data

    // TODO: get this from the current login
    // rather than hardcode it
    const companyId = 'P15951'

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
        vaccines: [],
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
    const users = data.users.slice(10, 20)

    res.render('pharmacies/users/index', {
      users
    })
  })

  router.get('/pharmacies/add-lead-admins',(req, res) => {
    const data = req.session.data
    const users = data.users.slice(10, 20)

    res.render('pharmacies/add-lead-admins', {
      users
    })
  })

  router.get('/pharmacies/users/:id',(req, res) => {
    const data = req.session.data
    const id = req.params.id
    const user = data.users.find((user) => user.id === id)

    res.render('pharmacies/users/user', {
      user
    })
  })


  router.get('/pharmacies/:id/add-user',(req, res) => {
    const data = req.session.data
    const users = data.users.slice(10, 30)
    const id = req.params.id
    const organisation = data.organisations.find((organisation) => organisation.id === id)

    res.render('pharmacies/add-user', {
      users,
      organisation
    })
  })

  router.get('/pharmacies/:id/add-user-permission-level',(req, res) => {
    const data = req.session.data
    const id = req.params.id
    const organisation = data.organisations.find((organisation) => organisation.id === id)
    let existingUser

    if (data.userId) {
      existingUser = data.users.find((user) => user.id === data.userId)
    }

    res.render('pharmacies/add-user-permission-level', {
      organisation,
      existingUser
    })
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

  router.get('/pharmacies/:id/user-added',(req, res) => {
    const data = req.session.data
    const id = req.params.id
    const organisation = data.organisations.find((organisation) => organisation.id === id)
    const existingUser = data.users.find((user) => user.id === data.userId)

    if (existingUser) {

      existingUser.organisations ||= []
      existingUser.organisations.push({
        id: organisation.id,
        status: 'Active',
        vaccinator: (data.vaccinator === 'yes'),
        permissionLevel: data.permissionLevel
      })
    } else {

      data.users.push({
        id: Math.floor(Math.random() * 10000000).toString(),
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        organisations: [
          {
            id: organisation.id,
            status: 'Invited',
            vaccinator: (data.vaccinator === 'yes'),
            permissionLevel: data.permissionLevel
          }
        ]
      })

    }

    // Reset data
    req.session.data.userId = ''
    req.session.data.email = ''
    req.session.data.firstName = ''
    req.session.data.lastName = ''
    req.session.data.permissionLevel = ''
    req.session.data.vaccinator = ''

    res.redirect(`/pharmacies/${organisation.id}?added=true`)
  })

  router.get('/pharmacies/:id', (req, res) => {
    const data = req.session.data
    const id = req.params.id

    const organisation = data.organisations.find((organisation) => organisation.id === id)

    const userOrganisationPermissions = {}

    const users = data.users
    .filter((user) => (user.organisations || [])
      .find((orgPermission) => orgPermission.id === organisation.id)
    )

    for (const user of users) {
      userOrganisationPermissions[user.id] = user.organisations.find((userOrganisation) => userOrganisation.id === organisation.id)
    }

    res.render('pharmacies/pharmacy', {
      organisation,
      users,
      userOrganisationPermissions
    })
  })

}
