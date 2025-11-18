module.exports = (router) => {

  // Viewing a region's stats
router.get('/support/regions', (req, res) => {
  const { id } = req.params

  const regions = req.session.data.organisations.filter((organisation) => organisation.type === 'Region')

  res.render('support/regions', {
    regions
  })
})

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

  // Viewing list of organisations
  router.get('/support/organisations', (req, res) => {

    const organisations = req.session.data.organisations

    res.render('support/organisations', {
      organisations
    })
  })

  // Viewing an organisation
  router.get('/support/organisations/:id', (req, res) => {
    const { id } = req.params
    const organisation = req.session.data.organisations.find((organisation) => organisation.id === id)

    const users = req.session.data.users.filter((user) => (user.organisations || []).find((organisation) => organisation.id === id))

    const vaccines = organisation.vaccines || []
    const vaccinesEnabled = vaccines.filter((vaccine) => vaccine.status === "enabled")


    res.render('support/organisations/show', {
      organisation,
      vaccinesEnabled,
      users
    })
  })

  // Add vaccine for an organisation page
  router.get('/support/organisations/:id/add-vaccines', (req, res) => {
    const { id } = req.params
    const data = req.session.data
    const organisation = data.organisations.find((organisation) => organisation.id === id)

    const organisationVaccines = organisation.vaccines || []
    const vaccineEnabledNames = organisationVaccines.filter((vaccine) => vaccine.status === "enabled").map((vaccine) => vaccine.name)

    const allVaccines = data.vaccines

    const vaccinesNotYetAdded = allVaccines.filter((vaccine) => !vaccineEnabledNames.includes(vaccine.name))


    res.render('support/organisations/add-vaccines', {
      organisation,
      vaccinesNotYetAdded
    })
  })

  // Updating vaccines enabled per organisation
  router.post('/support/organisations/:id/update-vaccines', (req, res) => {
    const data = req.session.data
    const id = req.params.id
    const organisation = data.organisations.find((org) => org.id === id)
    if (!organisation) { res.redirect('/support/'); return }

    const vaccinesToAdd = data.vaccinesToAdd

    if (!organisation.vaccines) {
      organisation.vaccines = []
    }

    let vaccines = organisation.vaccines

    for (let vaccineToAdd of vaccinesToAdd) {

      const existingVaccine = vaccines.find((vaccine) => vaccine.name === vaccineToAdd)

      if (existingVaccine) {
        existingVaccine.status = "enabled"
      } else {

        vaccines.push({
          name: vaccineToAdd,
          status: "enabled"
        })
      }
    }

    res.redirect(`/support/organisations/${id}`)
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

  // Update details from PDS
  router.get('/support/organisations/:id/update-details', (req, res) => {
    const { id } = req.params
    const organisation = req.session.data.organisations.find((organisation) => organisation.id === id)

    res.render('support/organisations/update-details', {
      organisation
    })
  })

  // Change an organisation’s region
  router.get('/support/organisations/:id/change-region', (req, res) => {
    const { id } = req.params
    const organisation = req.session.data.organisations.find((organisation) => organisation.id === id)

    res.render('support/organisations/change-region', {
      organisation
    })
  })

  // Change an organisation’s region
  router.get('/support/organisations/:id/update-region', (req, res) => {
    const { id } = req.params
    const organisation = req.session.data.organisations.find((organisation) => organisation.id === id)

    organisation.region = req.session.data.region

    res.redirect(`/support/organisations/${id}`)
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
          vaccinator: (req.body.vaccinator === "yes")
        }
      ]
    })

    res.redirect(`/support/organisations/${id}`)
  })

  // Viewing all users
  router.get('/support/users', (req, res) => {
    const data = req.session.data
    const allUsers = data.users
    const q = req.query.q;
    const perPage = 40; // Max number of users to show per page
    const page = parseInt(req.query.page) || 1  ;  // Current page, default to 1

    let users = allUsers.sort((a, b) => {
      const nameA = a.firstName.toUpperCase(); // ignore upper and lowercase
      const nameB = b.firstName.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    })

    if (q) {
      users = users.filter(function(user) {
        return (
          user.firstName.toLowerCase().startsWith(q.toLowerCase()) ||
          user.lastName.toLowerCase().startsWith(q.toLowerCase()) ||
          (user.firstName + " " + user.lastName).toLowerCase().startsWith(q.toLowerCase()) ||
          user.email.toLowerCase().startsWith(q.toLowerCase())
        )
      })
    }


    const totalUsers = users.length
    const indexStartFrom = (page - 1) * perPage
    const totalPages = Math.ceil(totalUsers / perPage)
    users = users.slice(indexStartFrom, indexStartFrom + perPage)


    res.render('support/users', {
      users,
      q,
      totalUsers,
      totalPages,
      page,
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
    const userOrganisationSettings = user.organisations.find((organisation) => organisation.id === organisationId)

    userOrganisationSettings.vaccinator = (req.body.vaccinator === "yes")
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
    const userRegionSettings = user.regions.find((region) => region.id === regionId)

    userRegionSettings.status = req.body.status

    res.redirect(`/support/users/${id}`)
  })

}
