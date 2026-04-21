module.exports = (router) => {

  router.get('/appointments', (req, res) => {
    const data = req.session.data

    const date = (req.query.date ? (new Date(req.query.date)) : (new Date()))
    const day = 86400000 // number of milliseconds in a day
    const previousDay = (new Date(date.getTime() - day)).toISOString().substring(0,10)
    const nextDay = (new Date(date.getTime() + day)).toISOString().substring(0,10)
    const currentDay = date.toISOString().substring(0,10)
    const today = (new Date()).toISOString().substring(0,10)

    let appointments = data.appointments

    if (currentDay === today) {
      appointments = appointments.filter((appointment) => appointment.date === "today" || appointment.date === today)
    } else if (nextDay === today) {
      appointments = appointments.filter((appointment) => appointment.date === "yesterday" || appointment.date === today)
    } else if (previousDay === today) {
      appointments = appointments.filter((appointment) => appointment.date === "tomorrow" || appointment.date === today)
    } else {
      appointments = appointments.filter((appointment) => appointment.date === today)
    }

    const scheduledAppointments = appointments.filter((appointment) => !appointment.cancelled && (appointment.vaccinationIds || []).length === 0)

    const cancelledAppointments = appointments.filter((appointment) => appointment.cancelled)

    const completedAppointments = appointments.filter((appointment) => (appointment.vaccinationIds || []).length > 0)


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
