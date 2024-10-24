module.exports = (router) => {

  router.get('/user-admin', (req, res) => {

    const perPage = 20; // Max number of users to show per page
    const page = parseInt(req.query.page) || 1  ;  // Current page, default to 1

    const q = req.query.q;
    const data = req.session.data;
    const statusesToInclude = ['Invited', 'Active'];
    let allUsers = data.users
      .filter((user) => statusesToInclude.includes(user.status))
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
      allUsers = allUsers.filter((user) => (user.firstName.toLowerCase() + " " + user.lastName.toLowerCase()).includes(q.toLowerCase())
      ||
      user.email.toLowerCase().includes(q.toLowerCase())
      )
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
      .filter((user) => user.status === 'Deactivated')

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
    user.status = 'Deactivated'
    user.deactivatedDate = new Date().toISOString().substring(0,10)

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
    const { role } = req.session.data
    const { clinician } = req.session.data

    let existingUserWithSameEmail = false
    if (email) {
      existingUserWithSameEmail = data.users.find((user) => user.email === email)
    }

    let firstNameError, lastNameError, emailError, roleError, clinicianError

    if (!firstName || firstName === '') {
      firstNameError = 'Enter first name'
    }

    if (!lastName || lastName === '') {
      lastNameError = 'Enter last name'
    }

    if (!email || email === '') {
      emailError = 'Enter NHS email address'
    } else if (!(email.endsWith('nhs.net') || email.endsWith('.nhs.uk'))) {
      emailError = 'Email address must be an NHS email'
    } else if (existingUserWithSameEmail && existingUserWithSameEmail.status !== 'Deactivated') {
      emailError = 'NHS email address already added as a user'
    }

    if (!role || role === '') {
      roleError = 'Select permission level'
    }

    if (!clinician || clinician === '') {
      clinicianError = 'Select if they’re a clinician'
    }

    if (firstNameError || lastNameError || emailError || roleError || clinicianError) {
      res.render('user-admin/add-user', {
        firstNameError,
        lastNameError,
        emailError,
        roleError,
        clinicianError
      })
    } else {
      res.redirect('/user-admin/check')
    }
  })

  // Adding a user
  router.post('/user-admin/add', (req, res) => {

    const data = req.session.data
    const {firstName, lastName, email, role, clinician} = data

    const existingUserWithSameEmail = data.users.find((user) => user.email === email)


    if (existingUserWithSameEmail) {

      // Update existing user instead
      existingUserWithSameEmail.firstName = firstName
      existingUserWithSameEmail.lastName = lastName
      existingUserWithSameEmail.role = role
      existingUserWithSameEmail.clinician = clinician
      existingUserWithSameEmail.status = 'Active'

    } else {
      req.session.data.users.push({
        id: Math.floor(Math.random() * 10000000).toString(),
        firstName: req.session.data.firstName,
        lastName: req.session.data.lastName,
        email: req.session.data.email,
        role: req.session.data.role,
        clinician: req.session.data.clinician,
        status: 'Invited'
      })
    }

    // Reset data
    req.session.data.email = ''
    req.session.data.firstName = ''
    req.session.data.lastName = ''
    req.session.data.role = ''
    req.session.data.clinician = ''
    req.session.data.showErrors = ''

    res.redirect('/user-admin')
  })

  // Editing a user’s role
  router.get('/user-admin/users/:id/change-role', (req, res) => {
    const { id } = req.params

    const numberOfLeadAdmins = req.session.data.users.filter((user) => (user.role === 'Lead administrator') && (user.status !== 'Deactivated')).length

    const user = req.session.data.users.find((user) => user.id === id)

    res.render('user-admin/change', {
      user,
      numberOfLeadAdmins
    })
  })

  // Updating a user’s role
  router.post('/user-admin/users/:id/update', (req, res) => {
    const { id } = req.params

    const user = req.session.data.users.find((user) => user.id === id)

    user.role = req.body.role
    user.clinician = req.body.clinician

    // Reset session data
    req.session.data.role = ''
    req.session.data.clinician = ''

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
