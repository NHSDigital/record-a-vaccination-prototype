module.exports = (router) => {

  router.get('/appointments', (req, res) => {
    const data = req.session.data

    const appointments = data.appointments

    const scheduledAppointments = appointments.filter((appointment) => !appointment.cancelled && (appointment.vaccinationIds || []).length === 0)

    const cancelledAppointments = appointments.filter((appointment) => appointment.cancelled)

    const completedAppointments = appointments.filter((appointment) => (appointment.vaccinationIds || []).length > 0)

    const date = (req.query.date ? (new Date(req.query.date)) : (new Date()))
    const day = 86400000 // number of milliseconds in a day
    const previousDay = (new Date(date.getTime() - day)).toISOString().substring(0,10)
    const nextDay = (new Date(date.getTime() + day)).toISOString().substring(0,10)
    const currentDay = date.toISOString().substring(0,10)
    const today = (new Date()).toISOString().substring(0,10)


    res.render('appointments/index', {
      scheduledAppointments,
      cancelledAppointments,
      completedAppointments,
      today,
      currentDay,
      previousDay,
      nextDay
    })
  })
}
