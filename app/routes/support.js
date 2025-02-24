module.exports = (router) => {

  // Viewing a region's stats
  router.get('/support/regions/:id', (req, res) => {
    const { id } = req.params
    const region = req.session.data.regions.find((region) => region.id === id)

    const organisations = req.session.data.organisations.filter((organisation) => organisation.region === id)

    const users = req.session.data.users.filter((user) => (user.regions || []).find((region) => region.id === id))

    res.render('support/region', {
      region,
      organisations,
      users
    })
  })

  // Viewing form to add user to a region
  router.get('/support/regions/:id/add-user', (req, res) => {
    const { id } = req.params
    const region = req.session.data.regions.find((region) => region.id === id)

    res.render('support/regions/add-user', {
      region
    })
  })

  // Adding a user to a region
  router.post('/support/regions/:id/users', (req, res) => {
    const { id } = req.params
    const region = req.session.data.regions.find((region) => region.id === id)

const userId = Math.floor(Math.random() * 10000000).toString()

    req.session.data.users.push({
      id: userId,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      regions: [
        {
          id: id,
          status: "Active"
        }
      ]
    })

    res.redirect(`/support/regions/${id}`)

  })

  // Viewing an organisation
  router.get('/support/organisations/:id', (req, res) => {
    const { id } = req.params
    const organisation = req.session.data.organisations.find((organisation) => organisation.id === id)

    const users = req.session.data.users.filter((user) => (user.organisations || []).find((organisation) => organisation.id === id))

    res.render('support/organisations/show', {
      organisation,
      users
    })
  })

  // Changing a feature flag
  router.get('/support/organisations/:id/feature-flag', (req, res) => {
    const { id } = req.params
    const organisation = req.session.data.organisations.find((organisation) => organisation.id === id)

    const featureFlag = req.session.data.featureFlags.find((featureFlag) => featureFlag.id === req.query.featureFlag)

    res.render('support/organisations/feature-flag', {
      organisation,
      featureFlag
    })
  })

  // Updating a feature flag
  router.post('/support/organisations/:id/set-feature-flag', (req, res) => {
    const { id } = req.params
    const organisation = req.session.data.organisations.find((organisation) => organisation.id === id)

    organisation.featureFlags ||= {}
    organisation.featureFlags[req.body.featureFlag] = req.body.featureFlagStatus

    res.redirect(`/support/organisations/${id}`)
  })


  // Adding a user to an organisation
  router.get('/support/organisations/:id/add-user', (req, res) => {
    const { id } = req.params
    const organisation = req.session.data.organisations.find((organisation) => organisation.id === id)

    res.render('support/organisations/add-user', {
      organisation
    })
  })

  // Adding a user to an organisation
  router.post('/support/organisations/:id/users', (req, res) => {
    const { id } = req.params
    const organisation = req.session.data.organisations.find((organisation) => organisation.id === id)

    const userId = Math.floor(Math.random() * 10000000).toString()

    req.session.data.users.push({
      id: userId,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      organisations: [
        {
          id: id,
          permissionLevel: req.body.permissionLevel,
          status: "Active",
          clinician: (req.body.clinician === "yes")
        }
      ]
    })

    res.redirect(`/support/organisations/${id}`)
  })

  // Viewing a user
  router.get('/support/users/:id', (req, res) => {
    const { id } = req.params
    const user = req.session.data.users.find((user) => user.id === id)

    res.render('support/users/show', {
      user
    })
  })

  // Viewing a user at an organisation
  router.get('/support/users/:id/organisations/:organisationId/change', (req, res) => {
    const { id, organisationId } = req.params
    const data = req.session.data
    const user = data.users.find((user) => user.id === id)
    const organisation = data.organisations.find((organisation) => organisation.id === organisationId)
    const userOrganisationSettings = user.organisations.find((organisation) => organisation.id === organisationId)

    res.render('support/users/edit-organisation', {
      user,
      organisation,
      userOrganisationSettings
    })
  })

  // Updating a user at an organisation
  router.post('/support/users/:id/organisations/:organisationId/update', (req, res) => {
    const { id, organisationId } = req.params
    const data = req.session.data
    const user = data.users.find((user) => user.id === id)
    const organisation = data.organisations.find((organisation) => organisation.id === organisationId)
    const userOrganisationSettings = user.organisations.find((organisation) => organisation.id === organisationId)

    userOrganisationSettings.clinician = (req.body.clinician === "yes")
    userOrganisationSettings.status = req.body.status
    userOrganisationSettings.permissionLevel = req.body.permissionLevel

    res.redirect(`/support/users/${id}`)
  })

  // Viewing a user at a region
  router.get('/support/users/:id/regions/:regionId/change', (req, res) => {
    const { id, regionId } = req.params
    const data = req.session.data
    const user = data.users.find((user) => user.id === id)
    const region = data.regions.find((region) => region.id === regionId)
    const userRegionSettings = user.regions.find((region) => region.id === regionId)

    res.render('support/users/edit-region', {
      user,
      region,
      userRegionSettings
    })
  })

// Updating a user at a region
  router.post('/support/users/:id/regions/:regionId/update', (req, res) => {
    const { id, regionId } = req.params
    const data = req.session.data
    const user = data.users.find((user) => user.id === id)
    const region = data.regions.find((region) => region.id === regionId)
    const userRegionSettings = user.regions.find((region) => region.id === regionId)

    userRegionSettings.status = req.body.status

    res.redirect(`/support/users/${id}`)
  })

}
