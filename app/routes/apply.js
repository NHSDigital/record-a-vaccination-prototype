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

    if (data.oneOrMany === "single" && data.organisationId != "") {
      res.redirect('/apply/check-pharmacy')
    } else if (data.oneOrMany === "chain" && data.pharmacyChainId != "") {
      res.redirect('/apply/check-pharmacy-chain')
    } else {
      res.redirect('/apply/start')
    }
  })

  router.get('/apply/check-pharmacy-chain', async (req, res) => {
    const data = req.session.data

    const organisation = await getOrganisation(data.pharmacyChainId)

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

    let pharmacies = await getPharmaciesBelongingToOrganisation(data.pharmacyChainId)

    pharmacies = pharmacies.sort(sortByNameThenPostcode((item) => item.address.postcode))

    res.render('apply/pharmacies', {
      pharmacies
    })
  })

  // Check list of selected pharmacies
  router.get('/apply/pharmacy-chain-check', async (req, res) => {
    const data = req.session.data

    let pharmacies = await getPharmaciesBelongingToOrganisation(data.pharmacyChainId)

    pharmacies = pharmacies.filter((pharmacy) => {
      return data.pharmacyIds.includes(pharmacy.id)
    }).sort(sortByNameThenPostcode())

    res.render('apply/pharmacy-chain-check', {
      pharmacies
    })
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

    const pharmacyChain = await getOrganisation(data.pharmacyChainId)

    let pharmacies = await getPharmaciesBelongingToOrganisation(data.pharmacyChainId)

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
