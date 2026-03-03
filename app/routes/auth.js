module.exports = router => {

  router.post('/auth/sign-in', (req, res) => {

    const data = req.session.data
    const email = data.email || "jane.smith@nhs.net"
    const user = data.users.find((user) => user.email === email)

    if (!user) {
      res.redirect('/auth/okta-sign-in')
      return
    }

    const userOrganisationIds = (user.organisations || [])
      .filter((organisation) => organisation.status === "Active")
      .map((organisation) => organisation.id)

    const organisationsUserIsAnAdminAt = (user.organisations || [])
    .filter((organisation) => (organisation.status === "Active" && ["Lead administrator", "Administrator"].includes(organisation.permissionLevel)))
    .map((organisation) => organisation.id)

    const userRegionIds = (user.regions || [])
      .filter((organisation) => organisation.status === "Active")
      .map((organisation) => organisation.id)

    // reset email and password
    req.session.data.email = ""
    req.session.data.password = ""

    if (user.admin) {
      req.session.data.currentUserId = user.id;
      req.session.data.currentOrganisationId = null
      res.redirect('/support')

    } else if (userOrganisationIds.length === 1) {

      req.session.data.currentUserId = user.id;
      req.session.data.currentOrganisationId = userOrganisationIds[0]

      res.redirect('/survey')

    } else if (userRegionIds.length === 1) {

      req.session.data.currentUserId = user.id
      req.session.data.currentOrganisationId = userRegionIds[0]

      res.redirect('/regions')

    } else if (organisationsUserIsAnAdminAt.length > 1) {

      req.session.data.userId = user.id
      res.redirect('/auth/select-mode')

    } else {

      res.redirect('/auth/select-organisation')

    }

  })


  router.post('/auth/answer-select-mode', (req, res) => {
    const data = req.session.data
    const loginMode = data.loginMode

    if (loginMode === 'single') {
      res.redirect('/auth/select-organisation?from=select-mode')
    } else if (loginMode === 'create-reports') {

      req.session.data.currentMode = "reports"
      req.session.data.currentOrganisationId = null
      req.session.data.currentUserId = data.userId


      res.redirect('/survey')
    } else {
      res.redirect('/auth/select-mode')
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
      email,
      organisations,
      from
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

      res.redirect('/survey')
    } else {

      res.redirect('/auth/select-organisation')
    }
  })

  router.get('/sign-out', (req, res) => {
    req.session.data.currentUserId = null
    req.session.data.currentOrganisationId = null
    req.session.data.currentMode = null

    res.redirect('/product-page')
  })

}
