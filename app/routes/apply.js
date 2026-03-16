  const { getPharmaciesBelongingToOrganisation, getPharmacyChains, getOrganisation } = require('../lib/ods');

module.exports = router => {

  router.get('/apply/start', async (req, res) => {
    const data = req.session.data

    const allOrganisations = data.allOrganisations.sort((a, b) => {
      if (a.name < b.name) {
        return -1
      } else if (a.name > b.name) {
        return 1
      } else {
        if (a.postcode < b.postcode) {
          return -1
        } else {
          return 1
        }
      }
    })
    const allPharmacies = allOrganisations.filter((organisation) => organisation.type === "Community pharmacy")

    const allPharmacyCompanies = await getPharmacyChains()

    res.render('apply/start', {
      allOrganisations,
      allPharmacies,
      allPharmacyCompanies
    })
  })

  router.post('/apply/check-pharmacy-chain', async (req, res) => {
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

    pharmacies = pharmacies.sort((a, b) => {
      if (a.name < b.name) {
        return -1
      } else if (a.name > b.name) {
        return 1
      } else {
        if (a.address.postcode < b.address.postcode) {
          return -1
        } else {
          return 1
        }
      }
    })

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
    })

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
