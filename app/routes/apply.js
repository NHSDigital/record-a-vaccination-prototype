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

  router.get('/apply/start', async (req, res) => {
    const data = req.session.data

    const allOrganisations = data.allOrganisations.sort(sortByNameThenPostcode())
    const allPharmacies = allOrganisations.filter((organisation) => organisation.type === "Community pharmacy")

    const allPharmacyCompanies = await getPharmacyChains()

    res.render('apply/start', {
      allOrganisations,
      allPharmacies,
      allPharmacyCompanies
    })
  })

  router.post('/apply/start-answer', (req, res) => {
    const data = req.session.data

    if (data.oneOrMany === "single") {
      res.redirect('/apply/find-single-pharmacy')
    } else if (data.oneOrMany === "chain") {
      res.redirect('/apply/group-of-pharmacies')
    } else {
      res.redirect('/apply/start')
    }
  })

  router.get('/apply/check-pharmacy-chain', async (req, res) => {
    const data = req.session.data

    const organisation = await getOrganisation(data.pharmacyCompanyId)

    res.render('apply/check-pharmacy-chain', {
      organisation
    })
  })

  router.post('/apply/answer-pharmacy', (req, res) => {
    const data = req.session.data

    const organisationId = data.organisationId
    const organisation = data.allOrganisations.find((organisation) => organisation.id === organisationId)

    if (!organisation) {
      res.redirect('/apply/start?error=no-pharmacy');
    } else if (organisation.id === "FA424") {
      res.redirect('/apply/start?error=existing-account');
    } else {
      res.redirect('/apply/check-pharmacy')
    }

  })

  router.get('/apply/find-pharmacy-company', async (req, res) => {
    const allPharmacyCompanies = await getPharmacyChains()

    res.render('apply/find-pharmacy-company', {
      allPharmacyCompanies
    })

  })


  router.post('/apply/answer-find-pharmacy-company', (req, res) => {
    res.redirect('/apply/check-pharmacy-chain')
    // const organisationId = data.organisationId
    // const organisation = data.allOrganisations.find((organisation) => organisation.id === organisationId)

    // if (!organisation) {
    //   res.redirect('/apply/start?error=no-pharmacy');
    // } else if (organisation.id === "FA424") {
    //   res.redirect('/apply/start?error=existing-account');
    // } else {
    //   res.redirect('/apply/check-pharmacy')
    // }

  })


  // Show organisation check page
  router.get('/apply/check-pharmacy', (req, res) => {
    const data = req.session.data
    const organisationId = data.organisationId
    const organisation = data.allOrganisations.find((organisation) => organisation.id === organisationId)
    if (!organisation) { res.redirect('/apply/start'); return }

    res.render('apply/check-pharmacy', {
      organisation
    })
  })

  // Select which pharmacies in the chain to onboard
  router.get('/apply/pharmacies', async (req, res) => {
    const data = req.session.data

    let pharmacies = await getPharmaciesBelongingToOrganisation(data.pharmacyCompanyId)

    pharmacies = pharmacies.sort(sortByNameThenPostcode((item) => item.address.postcode))

    res.render('apply/pharmacies', {
      pharmacies
    })
  })

  // Check list of selected pharmacies
  router.get('/apply/pharmacy-chain-check', async (req, res) => {
    const data = req.session.data

    let pharmacies = await getPharmaciesBelongingToOrganisation(data.pharmacyCompanyId)

    pharmacies = pharmacies.filter((pharmacy) => {
      return data.pharmacyIds.includes(pharmacy.id)
    }).sort(sortByNameThenPostcode())

    res.render('apply/pharmacy-chain-check', {
      pharmacies
    })
  })

  // Check list of selected pharmacies
  router.post('/apply/pharmacy-chain-check-remove-one', (req, res) => {
    const data = req.session.data
    const pharmacyIdToRemove = data.pharmacyIdToRemove

    data.pharmacyIds = data.pharmacyIds.filter(id => id !== pharmacyIdToRemove)

    res.redirect('/apply/pharmacy-chain-check')
  })


  // Check your answers page
  router.get('/apply/check', (req, res) => {
    const data = req.session.data
    const organisationId = data.organisationId
    const organisation = data.allOrganisations.find((organisation) => organisation.id === organisationId)
    if (!organisation) { res.redirect('/apply/start'); return }

    res.render('apply/check', {
      organisation
    })
  })

  // Check your answers page for a chain
  router.get('/apply/check-chain', async (req, res) => {
    const data = req.session.data

    const pharmacyChain = await getOrganisation(data.pharmacyCompanyId)

    let pharmacies = await getPharmaciesBelongingToOrganisation(data.pharmacyCompanyId)

    pharmacies = pharmacies.filter((pharmacy) => {
      return data.pharmacyIds.includes(pharmacy.id)
    })


    res.render('apply/check-chain', {
      pharmacyChain,
      pharmacies
    })
  })


  // Check your email page
  router.get('/apply/check-your-email', (req, res) => {
    const data = req.session.data
    const organisationId = data.organisationId
    const organisation = data.allOrganisations.find((organisation) => organisation.id === organisationId)

    if (!organisation) { res.redirect('/apply/start'); return }

    res.render('apply/check-your-email', {
      organisation
    })
  })


  // Routing after the final check answers page
  router.post('/apply/answer-check', (req, res) => {

    res.redirect('/apply/check-your-email')
  })

  // Routing after the final check answers for chains page
  router.post('/apply/check-chain-answer', async (req, res) => {
    const data = req.session.data

    let pharmacies = await getPharmaciesBelongingToOrganisation(data.pharmacyCompanyId)

    pharmacies = pharmacies.filter((pharmacy) => {
      return data.pharmacyIds.includes(pharmacy.id)
    })

    let userOrganisationPermissions = []

    for (const pharmacy of pharmacies) {

      // Add the pharmacy itself as the single site
      pharmacy.sites = [
        {
          id: pharmacy.id,
          name: pharmacy.name,
          address: pharmacy.address
        }
      ]

      data.organisations.push(pharmacy)
      userOrganisationPermissions.push({
        id: pharmacy.id,
        permissionLevel: 'Lead administrator',
        status: 'Active',
        vaccinator: false
      })
    }

    const user = {
      id: Math.floor(Math.random() * 10000000).toString(),
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      organisations: userOrganisationPermissions
    }

    data.users.push(user)

    res.redirect('/apply/check-your-email-chain')
  })

  // Welcome email mockup
  router.get('/apply/welcome-email', (req, res) => {
    const data = req.session.data
    const organisationId = data.organisationId
    const organisation = data.allOrganisations.find((organisation) => organisation.id === organisationId)
    if (!organisation) { res.redirect('/apply/start'); return }

    res.render('apply/welcome-email', {
      organisation
    })
  })

}
