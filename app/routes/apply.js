const sortByNameThenPostcode = (getPostcode = (item) => item.postcode) => (a, b) => {
  if (a.name < b.name) return -1
  if (a.name > b.name) return 1
  const postcodeA = getPostcode(a)
  const postcodeB = getPostcode(b)
  if (postcodeA < postcodeB) return -1
  return 1
}

const findOrganisationById = (data, organisationId) => {
  if (!organisationId) return null
  return (data.organisations || []).find((organisation) => organisation.id === organisationId) ||
    (data.allOrganisations || []).find((organisation) => organisation.id === organisationId)
}

module.exports = router => {

  router.get('/apply/start', (req, res) => {
    const data = req.session.data
    let errors = []

    if (req.query.error === 'no-pharmacy') {
      errors.push({
        text: 'Select a pharmacy',
        href: '#organisation-code'
      })
    } else if (req.query.error === 'existing-account') {
      errors.push({
        text: 'This pharmacy already has an account',
        href: '#organisation-code'
      })
    }

    const pharmacies = data.allOrganisations.sort(sortByNameThenPostcode()).filter((organisation) => organisation.type === "Community pharmacy")


    res.render('apply/start', {
      pharmacies,
      errors
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

  router.post('/apply/answer-pharmacy', (req, res) => {
    const data = req.session.data

    const organisationId = data.organisationCode || data.organisationId
    data.organisationId = organisationId
    const organisation = findOrganisationById(data, organisationId)

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
    const organisation = findOrganisationById(data, organisationId)
    if (!organisation) { res.redirect('/apply/start'); return }

    res.render('apply/check-pharmacy', {
      organisation
    })
  })


  // Check your answers page
  router.get('/apply/check', (req, res) => {
    const data = req.session.data
    const organisationId = data.organisationId
    const organisation = findOrganisationById(data, organisationId)
    if (!organisation) { res.redirect('/apply/start'); return }

    res.render('apply/check', {
      organisation
    })
  })

  // Check your email page
  router.get('/apply/check-your-email', (req, res) => {
    const data = req.session.data
    const organisationId = data.organisationId
    const organisation = findOrganisationById(data, organisationId)

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
    const organisation = findOrganisationById(data, organisationId)
    if (!organisation) { res.redirect('/apply/start'); return }

    res.render('apply/welcome-email', {
      organisation
    })
  })

}
