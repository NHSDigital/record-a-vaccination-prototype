module.exports = router => {

  router.post('/auth/sign-in', (req, res) => {

    const data = req.session.data
    const email = data.email
    const user = data.users.find((user) => user.email === email)

    if (email === 'freda.pink@nhs.net') {
      res.redirect('/auth/user-not-recognised')
      return
    } else if (email === 'james.blue@nhs.net') {
      res.redirect('/auth/keycloak-existing-account-new-login')
      return
    } else if (!user) {
      res.redirect('/auth/okta-sign-in')
      return
    }

    const userOrganisationIds = (user.organisations || [])
      .filter((organisation) => organisation.status === "Active")
      .map((organisation) => organisation.id)

    const userRegionIds = (user.regions || [])
      .filter((organisation) => organisation.status === "Active")
      .map((organisation) => organisation.id)


    if (user.admin) {
      req.session.data.currentUserId = user.id;
      req.session.data.currentOrganisationId = null
      res.redirect('/support')

    } else if (userOrganisationIds.length === 1) {

      req.session.data.currentUserId = user.id;
      req.session.data.currentOrganisationId = userOrganisationIds[0]

      res.redirect('/home')

    } else if (userRegionIds.length === 1) {

      req.session.data.currentUserId = user.id
      req.session.data.currentOrganisationId = userRegionIds[0]

      res.redirect('/regions')

    } else {

      res.redirect('/auth/select-organisation')

    }

  })

  router.get('/auth/select-organisation', (req, res) => {
    const data = req.session.data

    const email = data.email
    const user = data.users.find((user) => user.email === email)
    const from = req.query.from

    const userOrganisationIds = user.organisations.map((organisation) => organisation.id)
    const organisations = data.organisations.filter((organisation) => userOrganisationIds.includes(organisation.id) )

    res.render('auth/select-organisation', {
      organisations,
      from
    })

  })

  router.post('/select-organisation', (req, res) => {
    const data = req.session.data
    const selectedOrganisationId = data.organisationId
    const email = data.email
    const user = data.users.find((user) => user.email === email)

    if (selectedOrganisationId) {
      req.session.data.currentUserId = user.id
      req.session.data.currentOrganisationId = selectedOrganisationId;

      res.redirect('/home')
    } else {

      res.redirect('/auth/select-organisation')
    }
  })

  router.get('/sign-out', (req, res) => {
    req.session.data.currentUserId = null
    req.session.data.currentOrganisationId = null
    req.session.data.email = ""

    res.redirect('/product-page')
  })

}
