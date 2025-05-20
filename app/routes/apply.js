module.exports = router => {


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
    const data = req.session.data
    const vaccineTypes = (data.vaccineTypes || [])
    let nextPage

    if (vaccineTypes.includes('COVID-19') && data.organisationCode === 'FA02S') {
      nextPage = '/apply/no-contract'
    } else {
      nextPage = '/apply/check-your-email'
    }

    res.redirect(nextPage)
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
