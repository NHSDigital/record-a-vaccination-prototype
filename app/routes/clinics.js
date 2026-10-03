module.exports = router => {

  router.get('/clinics/check-in-status', (req, res) => {
    const checkedInAppointments = req.session.data.checkedInAppointments || {}

    return res.json({
      checkedInAppointments: Object.keys(checkedInAppointments).filter((appointmentId) => checkedInAppointments[appointmentId] === true)
    })
  })

  router.post('/clinics/check-in-status', (req, res) => {
    const appointmentId = String(req.body?.appointmentId || '')
    const checkedIn = req.body?.checkedIn

    if (!/^[a-z0-9-]{1,20}:\d{10}$/.test(appointmentId) || !['true', 'false'].includes(checkedIn)) {
      return res.status(400).json({ error: 'Invalid check-in update' })
    }

    const checkedInAppointments = req.session.data.checkedInAppointments || {}

    if (checkedIn === 'true') {
      checkedInAppointments[appointmentId] = true
    } else {
      delete checkedInAppointments[appointmentId]
    }

    req.session.data.checkedInAppointments = checkedInAppointments

    return res.json({ success: true })
  })

  router.post('/clinics/answer-patient-nhs-number-known', (req, res) => {
    const nhsNumberKnown = req.session.data.nhsNumberKnown

    if (nhsNumberKnown === 'yes') {
      return res.redirect('/clinics/patient-history')
    } else if (nhsNumberKnown === 'no') {
      return res.redirect('/clinics/patient-search')
    }

    return res.redirect('/clinics/patient')
  })

}
