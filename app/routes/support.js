module.exports = (router) => {

  // Viewing a region's stats
  router.get('/support/regions/:id', (req, res) => {
    const { id } = req.params
    const region = req.session.data.regions.find((region) => region.id === id)

    res.render('support/region', {
      region
    })
  })

  // Viewing an organisation
  router.get('/support/organisations/:id', (req, res) => {
    const { id } = req.params
    const organisation = req.session.data.organisations.find((organisation) => organisation.id === id)

    const users = req.session.data.users.filter((user) => user.organisations.find((organisation) => organisation.id === id))

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
    const user = req.session.data.users.find((user) => user.id === id)
    const organisation = req.organisations.data.users.find((organisation) => organisation.id === organisationId)
    const userOrganisationSettings = user.organisations.find((organisation) => organisations.id === organisationId)

    res.render('support/users/change-organisation', {
      user,
      organisation,
      userOrganisationSettings
    })
  })

}
