module.exports = (router) => {

  router.post('/prototype-admin/reset-data', (req, res) => {

    req.session.data = {}

    res.redirect('/')

  })
}
