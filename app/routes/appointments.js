module.exports = (router) => {

  router.get('/appointments', (req, res) => {
    const data = req.session.data

    const day = 86400000 // number of milliseconds in a day
    const today = (new Date()).toISOString().substring(0,10)
    const yesterday = (new Date(Date.now() - day)).toISOString().substring(0,10)
    const tomorrow = (new Date(Date.now() + day)).toISOString().substring(0,10)
    const requestedDay = req.query.date
    const allowedDays = [yesterday, today, tomorrow]

    if (requestedDay && !allowedDays.includes(requestedDay)) {
      return res.redirect('/appointments')
    }

    const currentDay = requestedDay || today
    const currentDate = new Date(currentDay)
    const previousDay = (new Date(currentDate.getTime() - day)).toISOString().substring(0,10)
    const nextDay = (new Date(currentDate.getTime() + day)).toISOString().substring(0,10)
    const isYesterday = currentDay === yesterday
    const isTomorrow = currentDay === tomorrow

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

    let vaccinators = []

    if (data.vaccinatorIds) {
      vaccinators = data.users.filter((user) => data.vaccinatorIds.includes(user.id))
    }


    res.render('appointments/index', {
      scheduledAppointments,
      cancelledAppointments,
      completedAppointments,
      today,
      currentDay,
      previousDay,
      nextDay,
      isYesterday,
      isTomorrow,
      vaccinators
    })
  })


  router.get('/appointments/vaccinators', (req, res) => {
    res.redirect('/appointments')
  })
}

