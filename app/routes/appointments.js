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
      vaccinators
    })
  })


  router.get('/appointments/vaccinators', (req, res) => {
    const data = req.session.data

    let otherVaccinators = data.users
    .filter((user) => {
      const userOrgnisationSetting = (user.organisations || []).find((organisation) => organisation.id === data.currentOrganisationId)

      return (user.id != data.currentUserId) && userOrgnisationSetting && userOrgnisationSetting.vaccinator && (userOrgnisationSetting.status === "Active")
    })
    .sort((a, b) => {
      const nameA = a.firstName.toUpperCase(); // ignore upper and lowercase
      const nameB = b.firstName.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    })

    res.render('appointments/vaccinators', {
      otherVaccinators
    })

  })
}

