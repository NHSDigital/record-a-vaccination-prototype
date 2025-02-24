module.exports = (router) => {

  router.get('/user-profile/v2', (req, res) => {
    const data = req.session.data
    const leadAdminUsersAtSameOrganisation = data.users.filter((user) => (user.organisations || []).find((organisation) => (organisation.id === data.currentOrganisationId && organisation.permissionLevel == 'Lead administrator')))

    res.render('user-profile/v2/index', {
      leadAdminUsersAtSameOrganisation
    })
  })


  // Updating user profile
  router.post('/user-profile/v1/update', (req, res) => {
    const currentUser = req.session.data.users.find((user) => user.id === req.session.data.currentUserId)

    if (req.body.firstName) {
      currentUser.firstName = req.body.firstName
    }

    if (req.body.lastName) {
      currentUser.lastName = req.body.lastName
    }

    if (req.body.email) {
      currentUser.lastName = req.body.email
    }

    if (req.body.professionalBody) {
      currentUser.professionalBody = req.body.professionalBody
    }

    if (req.body.doctorNumber) {
      currentUser.professionalBodyNumber = req.body.doctorNumber
    }

    if (req.body.nurseNumber) {
      currentUser.professionalBodyNumber = req.body.nurseNumber
    }

    res.redirect('/user-profile/v1')
  })

  // Updating user profile v2
  router.post('/user-profile/v2/update', (req, res) => {
    const currentUser = req.session.data.users.find((user) => user.id === req.session.data.currentUserId)

    if (req.body.firstName) {
      currentUser.firstName = req.body.firstName
    }

    if (req.body.lastName) {
      currentUser.lastName = req.body.lastName
    }

    res.redirect('/user-profile/v2')
  })
}
