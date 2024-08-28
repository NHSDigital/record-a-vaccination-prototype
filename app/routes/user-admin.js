module.exports = (router) => {
  // Adding a user
  router.post('/user-admin/v1/add', (req, res) => {
    req.session.data.users.push({
      id: Math.floor(Math.random() * 10000000).toString(),
      firstName: req.session.data.firstName,
      lastName: req.session.data.lastName,
      email: req.session.data.email,
      role: req.session.data.role,
      status: 'Invited'
    })

    // Reset data
    req.session.data.email = ''
    req.session.data.firstName = ''
    req.session.data.lastName = ''
    req.session.data.role = ''

    res.redirect('/user-admin/v1')
  })

  // Editing a user’s role
  router.get('/user-admin/v1/users/:id/change-role', (req, res) => {
    const { id } = req.params

    const user = req.session.data.users.find((user) => user.id === id)

    res.render('user-admin/v1/change-role', {
      user
    })
  })

  // Updating a user’s role
  router.post('/user-admin/v1/users/:id/update', (req, res) => {
    const { id } = req.params

    const user = req.session.data.users.find((user) => user.id === id)

    user.role = req.body.role

    // Reset session data
    req.session.data.role = ''

    res.redirect('/user-admin/v1')
  })

  // Adding a user - v2
  router.post('/user-admin/v2/add', (req, res) => {
    console.log(req.session.data)

    req.session.data.users.push({
      id: Math.floor(Math.random() * 10000000),
      firstName: req.session.data.firstName,
      lastName: req.session.data.lastName,
      email: req.session.data.email,
      permissions: req.session.data.permissions,
      status: 'Invited'
    })

    // Reset data
    req.session.data.email = ''
    req.session.data.firstName = ''
    req.session.data.lastName = ''
    req.session.data.permissions = []

    res.redirect('/user-admin/v2')
  })

  // Editing a user’s role
  router.get('/user-admin/v2/users/:id/change-permissions', (req, res) => {
    const { id } = req.params

    const user = req.session.data.users.find((user) => user.id === id)

    res.render('user-admin/v2/change-permissions', {
      user
    })
  })

  // Updating a user’s role
  router.post('/user-admin/v2/users/:id/update', (req, res) => {
    const { id } = req.params

    const user = req.session.data.users.find((user) => user.id === id)

    user.permissions = req.session.data.permissions

    // Reset session data
    req.session.data.permissions = []

    res.redirect('/user-admin/v2')
  })

  // Adding a user - V3
  router.post('/user-admin/v3/add', (req, res) => {
    const { professionalBody } = req.session.data

    req.session.data.users.push({
      id: Math.floor(Math.random() * 10000000).toString(),
      firstName: req.session.data.firstName,
      lastName: req.session.data.lastName,
      email: req.session.data.email,
      role: req.session.data.role,
      professionalBody,
      status: 'Invited'
    })

    // Reset data
    req.session.data.email = ''
    req.session.data.firstName = ''
    req.session.data.lastName = ''
    req.session.data.role = ''
    req.session.data.professionalBody = ''

    res.redirect('/user-admin/v3')
  })

  // Editing a user’s role
  router.get('/user-admin/v3/users/:id/change-role', (req, res) => {
    const { id } = req.params

    const user = req.session.data.users.find((user) => user.id === id)

    res.render('user-admin/v3/change-role', {
      user
    })
  })

  // Updating a user’s role
  router.post('/user-admin/v3/users/:id/update', (req, res) => {
    const { id } = req.params

    const user = req.session.data.users.find((user) => user.id === id)

    user.role = req.body.role

    // Reset session data
    req.session.data.role = ''

    res.redirect('/user-admin/v3')
  })

  router.get('/user-admin/v4', (req, res) => {

    const data = req.session.data;
    const statusesToInclude = ['Invited', 'Active'];
    const users = data.users.filter((user) => statusesToInclude.includes(user.status))

    const deactivatedUsers = data.users.filter((user) => user.status === 'Deactivated')

    res.render('user-admin/v4/index',{
      users,
      deactivatedUsers
    })
  })

  router.get('/user-admin/v4/deactivated', (req, res) => {

    const data = req.session.data;
    const deactivatedUsers = data.users
      .filter((user) => user.status === 'Deactivated')

    res.render('user-admin/v4/deactivated',{
      deactivatedUsers
    })
  })

  router.get('/user-admin/v4/:id/deactivate', (req, res) => {

    const data = req.session.data;
    const user = req.session.data.users.find((user) => user.id === req.params.id)

    res.render('user-admin/v4/deactivate',{
      user
    })
  })

  router.post('/user-admin/v4/:id/deactivate', (req, res) => {

    const data = req.session.data;
    const user = req.session.data.users.find((user) => user.id === req.params.id)
    user.status = 'Deactivated'
    user.deactivatedDate = new Date().toISOString().substring(0,10)

    res.redirect('/user-admin/v4/deactivated')
  })

  router.get('/user-admin/v4/:id/reactivate', (req, res) => {

    const data = req.session.data;
    const user = req.session.data.users.find((user) => user.id === req.params.id)

    res.render('user-admin/v4/reactivate',{
      user
    })
  })

  router.post('/user-admin/v4/:id/reactivate', (req, res) => {

    const data = req.session.data;
    const user = req.session.data.users.find((user) => user.id === req.params.id)
    user.status = 'Active'

    res.redirect('/user-admin/v4')
  })

  router.post('/user-admin/v4/check-answers', (req, res) => {
    const { firstName } = req.session.data
    const { lastName } = req.session.data
    const { email } = req.session.data
    const { role } = req.session.data
    const { clinician } = req.session.data

    if (firstName && firstName !== '' && lastName && lastName !== '' && email && email !== '' && role && role !== '' && clinician && clinician !== '') {
      res.redirect('/user-admin/v4/check')
      req.session.data.showErrors = ''
    } else {
      res.redirect('/user-admin/v4/add-user?showErrors=true')
    }
  })

  // Adding a user - V4
  router.post('/user-admin/v4/add', (req, res) => {
    req.session.data.users.push({
      id: Math.floor(Math.random() * 10000000).toString(),
      firstName: req.session.data.firstName,
      lastName: req.session.data.lastName,
      email: req.session.data.email,
      role: req.session.data.role,
      clinician: req.session.data.clinician,
      status: 'Invited'
    })

    // Reset data
    req.session.data.email = ''
    req.session.data.firstName = ''
    req.session.data.lastName = ''
    req.session.data.role = ''
    req.session.data.clinician = ''
    req.session.data.showErrors = ''

    res.redirect('/user-admin/v4')
  })

  // Editing a user’s role
  router.get('/user-admin/v4/users/:id/change-role', (req, res) => {
    const { id } = req.params

    const user = req.session.data.users.find((user) => user.id === id)

    res.render('user-admin/v4/change', {
      user
    })
  })

  // Updating a user’s role
  router.post('/user-admin/v4/users/:id/update', (req, res) => {
    const { id } = req.params

    const user = req.session.data.users.find((user) => user.id === id)

    user.role = req.body.role
    user.clinician = req.body.clinician

    // Reset session data
    req.session.data.role = ''
    req.session.data.clinician = ''

    res.redirect('/user-admin/v4')
  })
}
