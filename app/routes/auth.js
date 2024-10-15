module.exports = router => {

  router.get('/select-organisation', (req, res) => {

    // Set organisation and user Id
    req.session.data.currentOrganisationId = req.session.data.organisations[1].id
    req.session.data.currentUserId = "12345";

    res.render('select-organisation', {
      organisations
    })

  })

  router.get('/sign-in-as-single-org-user', (req ,res) => {

    const organisationId = req.session.data.organisationId

    res.redirect('/home')
  })

  router.post('/select-organisation', (req, res) => {
    const organisationId = req.session.data.organisationId

    if (organisationId) {
      req.session.data.currentUserId = "12345";
      req.session.data.currentOrganisationId = organisationId;

      // Reset data
      delete req.session.data.organisationId
      req.session.data.multiOrganisation = "no"

      res.redirect('/home')
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

    res.redirect('/signed-out')
  })

}
