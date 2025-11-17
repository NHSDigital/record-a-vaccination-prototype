module.exports = router => {

  router.post('/auth/sign-in', (req, res) => {

    const data = req.session.data
    const email = data.email || "jane.smith@nhs.net"
    const user = data.users.find((user) => user.email === email)

    if (!user) {
      res.redirect('/auth/okta-sign-in')
      return
    }

    const userOrganisationIds = user.organisations
      .filter((organisation) => organisation.status === "Active")
      .map((organisation) => organisation.id)

    if (userOrganisationIds.length === 1) {

      req.session.data.currentUserId = user.id;
      req.session.data.currentOrganisationId = userOrganisationIds.first

      res.redirect('/home/')
    } else {
      res.redirect('/auth/select-organisation')
    }

  })


  router.get('/auth/select-organisation', (req, res) => {
    const data = req.session.data
    const email = data.email
    const user = data.users.find((user) => user.email === email)

    const userOrganisationIds = user.organisations.map((organisation) => organisation.id)
    const organisations = data.organisations.filter((organisation) => userOrganisationIds.includes(organisation.id) )

    res.render('auth/select-organisation', {
      email,
      organisations
    })

  })

  router.post('/select-organisation', (req, res) => {

    const data = req.session.data
    const email = data.email
    const user = data.users.find((user) => user.email === email)


    const selectedOrganisationId = req.session.data.organisationId


    if (selectedOrganisationId) {
      req.session.data.currentUserId = user.id;
      req.session.data.currentOrganisationId = selectedOrganisationId;

      res.redirect('/home')
    } else {

      res.redirect('/auth/select-organisation')
    }
  })

  router.get('/sign-out', (req, res) => {
    req.session.data.currentUserId = null

    res.redirect('/product-page')
  })

}
