module.exports = (router) => {

  router.get('/user-profile', (req, res) => {

    console.log(`current org id from user profile: ${req.session.data.currentOrganisationId}`)

    const data = req.session.data
    const leadAdminUsersAtSameOrganisation = data.users.filter((user) => (user.organisations || []).find((organisation) => (organisation.id === data.currentOrganisationId && organisation.permissionLevel == 'Lead administrator')))

    res.render('user-profile/index', {
      leadAdminUsersAtSameOrganisation
    })
  })


  // Updating user profile
  router.post('/user-profile/update', (req, res) => {
    const currentUser = req.session.data.users.find((user) => user.id === req.session.data.currentUserId)

    if (req.body.firstName) {
      currentUser.firstName = req.body.firstName
    }

    if (req.body.lastName) {
      currentUser.lastName = req.body.lastName
    }

    res.redirect('/user-profile')
  })
}
