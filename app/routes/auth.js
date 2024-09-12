module.exports = router => {

  router.get('/select-organisation', (req, res) => {

    const organisations = req.session.data.organisations.filter((organisation) =>  ["FAC81", "FA464"].includes(organisation.id))

    res.render('select-organisation', {
      organisations
    })

  })

  router.post('/select-organisation', (req, res) => {
    const organisationId = req.session.data.organisationId

    if (organisationId) {
      req.session.data.currentUserId = "12345";
      req.session.data.currentOrganisationId = organisationId;

      // Reset data
      delete req.session.data.organisationId
      req.session.data.multiOrganisation = "no"

      res.redirect('/find-a-patient')
    } else {

      const error = {
        text: "Select an organisation",
        href: "#organisationId-1"
      }

      const organisations = req.session.data.organisations.filter((organisation) =>  ["FAC81", "FA464"].includes(organisation.id))

      res.render('select-organisation', {
        error,
        organisations
      })
    }
  })

  router.get('/sign-out', (req, res) => {
    req.session.data.currentUserId = null

    res.redirect('/home')
  })

}
