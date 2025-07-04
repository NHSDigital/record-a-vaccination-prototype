module.exports = (router) => {

  router.get('/user-admin', (req, res) => {

    const perPage = 20; // Max number of users to show per page
    const page = parseInt(req.query.page) || 1  ;  // Current page, default to 1

    const q = req.query.q;
    const data = req.session.data;
    const statusesToInclude = ['Invited', 'Active'];
    let allUsers = data.users
      .filter((user) => {

        const userOrgnisationSetting = (user.organisations || []).find((organisation) => organisation.id === data.currentOrganisationId)

        return userOrgnisationSetting && statusesToInclude.includes(userOrgnisationSetting.status)
      })
      .sort((a, b) => {
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
      allUsers = allUsers.filter(function(user) {
        return (
          user.firstName.toLowerCase().startsWith(q.toLowerCase()) ||
          user.lastName.toLowerCase().startsWith(q.toLowerCase()) ||
          (user.firstName + " " + user.lastName).toLowerCase().startsWith(q.toLowerCase()) ||
          user.email.toLowerCase().startsWith(q.toLowerCase())
        )
      })
    }


    const totalUsers = allUsers.length

    const indexStartFrom = (page - 1) * perPage

    const users = allUsers.slice(indexStartFrom, indexStartFrom + perPage)
    const totalPages = Math.ceil(totalUsers / perPage)


    const deactivatedUsers = data.users.filter((user) => user.status === 'Deactivated')

    res.render('user-admin/index',{
      totalUsers,
      totalPages,
      page,
      users,
      deactivatedUsers,
      q
    })
  })

  router.get('/user-admin/deactivated', (req, res) => {

    const data = req.session.data;
    const deactivatedUsers = data.users
      .filter((user) => {
        const userOrganisationSetting = (user.organisations || []).find((organisation) => organisation.id === data.currentOrganisationId)

        return userOrganisationSetting && userOrganisationSetting.status === 'Deactivated'
      })
      .sort((a, b) => {
        const deactivatedA = a.organisations.find((organisation) => organisation.id == data.currentOrganisationId).deactivatedDate
        const deactivatedB = b.organisations.find((organisation) => organisation.id == data.currentOrganisationId).deactivatedDate
        if (deactivatedA > deactivatedB) {
          return -1;
        }
        if (deactivatedA < deactivatedB) {
          return 1;
        }
        return 0;
      })


    res.render('user-admin/deactivated',{
      deactivatedUsers
    })
  })

  router.get('/user-admin/check', (req, res) => {

    const data = req.session.data;
    const {email, firstName, lastName} = data;
    let existingUserWithSameEmail = false
    if (email) {
      existingUserWithSameEmail = data.users.find((user) => user.email === email)
    }

    res.render('user-admin/check', {
      firstName,
      lastName,
      existingUserWithSameEmail
    })
  })

  router.get('/user-admin/:id/deactivate', (req, res) => {

    const data = req.session.data;
    const user = req.session.data.users.find((user) => user.id === req.params.id)

    res.render('user-admin/deactivate',{
      user
    })
  })

  router.post('/user-admin/:id/deactivate', (req, res) => {

    const data = req.session.data;
    const user = req.session.data.users.find((user) => user.id === req.params.id)

    const organisationSetting = user.organisations.find((organisation) => organisation.id === data.currentOrganisationId)

    organisationSetting.status = 'Deactivated'
    organisationSetting.deactivatedDate = new Date().toISOString().substring(0,10)

    if (data.currentUserId === user.id) {
      // User deactivated themself
      res.redirect('/')
    } else {
      res.redirect('/user-admin/deactivated')
    }
  })

  router.get('/user-admin/:id/reactivate', (req, res) => {

    const data = req.session.data;
    const user = req.session.data.users.find((user) => user.id === req.params.id)

    res.render('user-admin/reactivate',{
      user
    })
  })

  router.post('/user-admin/:id/reactivate', (req, res) => {

    const data = req.session.data;
    const user = req.session.data.users.find((user) => user.id === req.params.id)
    user.status = 'Active'

    res.redirect('/user-admin')
  })

  router.post('/user-admin/check-answers', (req, res) => {
    const data = req.session.data
    const { firstName } = req.session.data
    const { lastName } = req.session.data
    const { email } = req.session.data
    const { permissionLevel } = req.session.data
    const { vaccinator } = req.session.data

    let existingUserWithSameEmail = false
    if (email) {
      existingUserWithSameEmail = data.users.find((user) => user.email === email)
    }

    let firstNameError, lastNameError, emailError, permissionLevelError, vaccinatorError

    if (!firstName || firstName === '') {
      firstNameError = 'Enter a first name'
    }

    if (!lastName || lastName === '') {
      lastNameError = 'Enter a last name'
    }

    if (!email || email === '') {
      emailError = 'Enter an NHS-approved email address'
    } else if (!(email.endsWith('nhs.net') || email.endsWith('.nhs.uk'))) {
      emailError = 'Email address must be NHS-approved'
    } else if (existingUserWithSameEmail && existingUserWithSameEmail.status !== 'Deactivated') {
      emailError = 'This email address has already been added'
    }

    if (!permissionLevel || permissionLevel === '') {
      permissionLevelError = 'Select a permission level'
    }

    if (!vaccinator || vaccinator === '') {
      vaccinatorError = 'Select if they’re a vaccinator'
    }

    if (firstNameError || lastNameError || emailError || permissionLevelError || vaccinatorError) {
      res.render('user-admin/add-user', {
        firstNameError,
        lastNameError,
        emailError,
        permissionLevelError,
        vaccinatorError
      })
    } else {
      res.redirect('/user-admin/check')
    }
  })

  // Adding a user
  router.post('/user-admin/add', (req, res) => {

    const data = req.session.data
    const {firstName, lastName, email, permissionLevel, vaccinator} = data

    const existingUserWithSameEmail = data.users.find((user) => user.email === email)


    if (existingUserWithSameEmail) {

      // Update existing user instead
      existingUserWithSameEmail.organisations.push({
        id: data.currentOrganisationId,
        status: 'Invited',
        vaccinator: (data.vaccinator === 'yes'),
        permissionLevel: data.permissionLevel
      })

    } else {
      req.session.data.users.push({
        id: Math.floor(Math.random() * 10000000).toString(),
        firstName: req.session.data.firstName,
        lastName: req.session.data.lastName,
        email: req.session.data.email,
        organisations: [
          {
            id: data.currentOrganisationId,
            status: 'Invited',
            vaccinator: (data.vaccinator === 'yes'),
            permissionLevel: data.permissionLevel
          }
        ]
      })
    }

    // Reset data
    req.session.data.email = ''
    req.session.data.firstName = ''
    req.session.data.lastName = ''
    req.session.data.permissionLevel = ''
    req.session.data.vaccinator = ''
    req.session.data.showErrors = ''

    res.redirect('/user-admin')
  })

  // Editing a user’s permission level and vaccinator status
  router.get('/user-admin/users/:id/change-role', (req, res) => {
    const { id } = req.params
    const data = req.session.data

    const numberOfLeadAdmins = data.users.filter((user) => (user.organisations || []).find((organisation) => (organisation.id === data.currentOrganisationId && organisation.permissionLevel == 'Lead administrator'))).length


    const user = req.session.data.users.find((user) => user.id === id)

    res.render('user-admin/change', {
      user,
      numberOfLeadAdmins
    })
  })

  // Updating a user’s permission level and vaccinator status
  router.post('/user-admin/users/:id/update', (req, res) => {
    const { id } = req.params

    const user = req.session.data.users.find((user) => user.id === id)

    const organisationSetting = user.organisations.find((organisation) => organisation.id === req.session.data.currentOrganisationId)

    organisationSetting.permissionLevel = req.body.permissionLevel
    organisationSetting.vaccinator = (req.body.vaccinator === 'yes')

    // Reset session data
    req.session.data.permissionLevel = ''
    req.session.data.vaccinator = ''

    res.redirect('/user-admin')
  })


  // Redirect the old versioned routes. These can be removed
  // at some point in the future.
  router.get('/user-admin/v4', (req, res) => {
    res.redirect('/user-admin')
  })

  router.get('/user-admin/v4/:page*', (req, res) => {
    res.redirect('/user-admin')
  })
}
