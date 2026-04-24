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

    const userOrganisationIds = currentUser.organisations.map((organisation) => organisation.id)

    const organisations = data.organisations.filter((organisation) => userOrganisationIds.includes(organisation.id) )


    res.render('pharmacies/index', {
      organisations
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

  router.get('/pharmacies/users',(req, res) => {
    const data = req.session.data
    const users = data.users.slice(10, 20)

    res.render('pharmacies/users/index', {
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


  router.get('/pharmacies/:id', (req, res) => {
    const data = req.session.data
    const id = req.params.id

    const organisation = data.organisations.find((organisation) => organisation.id === id)

    res.render('pharmacies/pharmacy', {
      organisation
    })
  })


}
