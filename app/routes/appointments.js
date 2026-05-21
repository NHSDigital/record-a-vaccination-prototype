module.exports = (router) => {

  router.get('/appointments', (req, res) => {
    const data = req.session.data

    const day = 86400000 // number of milliseconds in a day
    const toDateString = (offsetDays = 0) => (new Date(Date.now() + (offsetDays * day))).toISOString().substring(0,10)
    const today = toDateString()
    const yesterday = toDateString(-1)
    const tomorrow = toDateString(1)
    const maxFutureDay = toDateString(7)
    const requestedDay = req.query.date
    const allowedDays = [yesterday, today]

    for (let futureDayOffset = 1; futureDayOffset <= 7; futureDayOffset++) {
      allowedDays.push(toDateString(futureDayOffset))
    }

    if (requestedDay && !allowedDays.includes(requestedDay)) {
      return res.redirect('/appointments')
    }

    const currentDay = requestedDay || today
    const currentDate = new Date(currentDay)
    const previousDay = (new Date(currentDate.getTime() - day)).toISOString().substring(0,10)
    const nextDay = (new Date(currentDate.getTime() + day)).toISOString().substring(0,10)
    const isYesterday = currentDay === yesterday
    const isMaxFutureDay = currentDay === maxFutureDay

    let appointments = data.appointments

    if (currentDay === today) {
      appointments = appointments.filter((appointment) => appointment.date === "today" || appointment.date === today)
    } else if (currentDay === yesterday) {
      appointments = appointments.filter((appointment) => appointment.date === "yesterday" || appointment.date === yesterday)
    } else if (currentDay === tomorrow) {
      appointments = appointments.filter((appointment) => appointment.date === "tomorrow" || appointment.date === tomorrow)
    } else {
      appointments = appointments.filter((appointment) => appointment.date === currentDay)
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
      isMaxFutureDay,
      vaccinators
    })
  })


  router.get('/appointments/vaccinators', (req, res) => {
    res.redirect('/appointments')
  })
}

