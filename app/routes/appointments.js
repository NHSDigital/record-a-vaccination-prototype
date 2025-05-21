module.exports = router => {

  router.post('/appointments/answer-setup', (req, res) => {
    const data = req.session.data
    const answer = data.appointmentSystem

    if (answer === 'spreadsheet') {
      res.redirect('/appointments/upload-spreadsheet')
    } else {
      res.redirect('/appointments/setup')
    }

  })

}
