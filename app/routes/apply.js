module.exports = router => {


  // Show organisation check page
  router.get('/apply/check-pharmacy', (req, res) => {
    const data = req.session.data
    const organisationCode = data.organisationCode
    const organisation = data.organisations.find((organisation) => organisation.id === organisationCode)

    res.render('apply/check-pharmacy', {
      organisation
    })
  })

  // Check your answers page
  router.get('/apply/check', (req, res) => {
    const data = req.session.data
    const organisationCode = data.organisationCode
    const organisation = data.organisations.find((organisation) => organisation.id === organisationCode)

    res.render('apply/check', {
      organisation
    })
  })


  // Routing after the final check answers page
  router.post('/apply/answer-check', (req, res) => {
    const data = req.session.data
    let nextPage

    if (data.vaccineTypes.includes('COVID-19') && data.organisationCode === 'FA02S') {
      nextPage = '/apply/no-contract'
    } else {
      nextPage = '/apply/check-your-email'
    }

    // Reset answers
    data.organisationCode = null
    data.vaccineTypes = null
    data.firstName = null
    data.lastName = null
    data.email = null

    res.redirect(nextPage)
  })

}
