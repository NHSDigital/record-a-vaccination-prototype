module.exports = (router) => {

  router.get('/appointments', (req, res) => {
    const data = req.session.data

    const appointments = data.appointments

    res.render('appointments/index', {
      appointments
    })
  })
}
