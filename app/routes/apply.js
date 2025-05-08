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


}
