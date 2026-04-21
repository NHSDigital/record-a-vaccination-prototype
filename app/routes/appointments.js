module.exports = (router) => {

  router.get('/appointments', (req, res) => {
    const data = req.session.data

    const appointments = data.appointments

    const scheduledAppointments = appointments.filter((appointment) => !appointment.cancelled && (appointment.vaccinationIds || []).length === 0)

    const cancelledAppointments = appointments.filter((appointment) => appointment.cancelled)

    const completedAppointments = appointments.filter((appointment) => (appointment.vaccinationIds || []).length > 0)

    res.render('appointments/index', {
      scheduledAppointments,
      cancelledAppointments,
      completedAppointments
    })
  })
}
