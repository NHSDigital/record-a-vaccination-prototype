module.exports = router => {

  router.get('/apply/start', (req, res) => {
    let errors = []

    const error = req.query.error

    if (error === "no-pharmacy") {
      errors.push({
        text: "Select pharmacy",
        href: "#organisation-code"
      })
    } else if (error === "existing-account") {
      errors.push({
        text: "This pharmacy already has access to the service.",
        href: "#organisation-code"
      })
    }

    res.render('apply/start', {
      errors
    })
  })


  router.post('/apply/answer-pharmacy', (req, res) => {
    const data = req.session.data
    const organisationCode = data.organisationCode
    const organisation = data.organisations.find((organisation) => organisation.id === organisationCode)


    console.log(req.body)
    console.log(req.session.data)

    if (!organisation) {
      res.redirect('/apply/start?error=no-pharmacy');
    } else if (organisation.id === "FA424") {
      res.redirect('/apply/start?error=existing-account');
    } else {
      res.redirect('/apply/check-pharmacy')
    }

    res.render('apply/start', {
      errors
    })

  })


  // Show organisation check page
  router.get('/apply/check-pharmacy', (req, res) => {
    const data = req.session.data
    const organisationCode = data.organisationCode
    const organisation = data.organisations.find((organisation) => organisation.id === organisationCode)
    if (!organisation) { res.redirect('/apply/start'); return }

    res.render('apply/check-pharmacy', {
      organisation
    })
  })

  // Check your answers page
  router.get('/apply/check', (req, res) => {
    const data = req.session.data
    const organisationCode = data.organisationCode
    const organisation = data.organisations.find((organisation) => organisation.id === organisationCode)
    if (!organisation) { res.redirect('/apply/start'); return }

    res.render('apply/check', {
      organisation
    })
  })

  // Check your email page
  router.get('/apply/check-your-email', (req, res) => {
    const data = req.session.data
    const organisationCode = data.organisationCode
    const organisation = data.organisations.find((organisation) => organisation.id === organisationCode)

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
    const organisationCode = data.organisationCode
    const organisation = data.organisations.find((organisation) => organisation.id === organisationCode)
    if (!organisation) { res.redirect('/apply/start'); return }

    res.render('apply/welcome-email', {
      organisation
    })
  })

}
