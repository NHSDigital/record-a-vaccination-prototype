module.exports = router => {

  router.get('/apply/start', (req, res) => {
    let errors = []

    const error = req.query.error

    if (error === "no-pharmacy") {
      errors.push({
        text: "Select pharmacy",
        href: "#organisation-id"
      })
    } else if (error === "existing-account") {
      errors.push({
        text: "This pharmacy already has access to the service.",
        href: "#organisation-id"
      })
    }

    res.render('apply/start', {
      errors
    })
  })


  router.post('/apply/answer-pharmacy', (req, res) => {
    const data = req.session.data
    const organisationId = data.organisationId
    const organisation = data.allOrganisations.find((organisation) => organisation.id === organisationId)

    console.log(organisation)

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
