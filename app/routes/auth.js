module.exports = router => {

  router.post('/select-organisation', (req, res) => {
    const organisationId = req.session.data.organisationId

    if (organisationId) {
      req.session.data.currentUserId = "12345";

      // Reset data
      delete req.session.data.organisationId
      req.session.data.multiOrganisation = "no"

      res.redirect('/find-a-patient')
    } else {

      const error = {
        text: "Select an organisation",
        href: "#organisationId-1"
      }

      res.render('select-organisation', {
        error
      })
    }
  })

  router.get('/sign-out', (req, res) => {
    req.session.data.currentUserId = null

    res.redirect('/home')
  })

}
