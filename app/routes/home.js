module.exports = router => {

  // Dashboard
  router.get('/home', (req, res) => {
    const data = req.session.data
    const vaccinationsRecorded = data.vaccinationsRecorded

    const dateToday = new Date()


    const dayToday = (dateToday.getDate())

    // Months in JavaScript are zero-indexed
    const monthToday = (dateToday.getMonth() + 1)
    const yearToday = (dateToday.getFullYear())

    const stats = []

    const totalVaccinationsRecorded = vaccinationsRecorded.length

    const totalVaccinationsRecordedToday = vaccinationsRecorded.filter((vaccination) => {
      return (
        parseInt(vaccination.date.day) == dayToday &&
        parseInt(vaccination.date.month) == monthToday,
        parseInt(vaccination.date.year) == yearToday
      )
    }).length

    const totalVaccinationsRecordedPast7Days = vaccinationsRecorded.filter((vaccination) => {

      const vaccinationYear = parseInt(vaccination.date.year)
      const vaccinationMonth = parseInt(vaccination.date.month)
      const vaccinationDay = parseInt(vaccination.date.day)
      const vaccinationDate = new Date(Date.UTC(vaccinationYear, (vaccinationMonth - 1), vaccinationDay, 0, 0, 0));

      const daysAgo = Math.floor((dateToday - vaccinationDate) / (1000*60*60*24))

      return (daysAgo < 8)
    }).length

    const totalVaccinationsRecordedThisMonth = vaccinationsRecorded.filter((vaccination) => {
      return (
        parseInt(vaccination.date.month) == monthToday,
        parseInt(vaccination.date.year) == yearToday
      )
    }).length

    const organisationVaccines = res.locals.currentOrganisation.vaccines || []

    const vaccinesEnabledNames = organisationVaccines
      .filter((vaccine) => vaccine.status === "enabled")
      .map((vaccine) => vaccine.name)

    let vaccines = vaccinesEnabledNames

    for (vaccine of vaccines) {

      let vaccineStat = {
        vaccine: vaccine,
        days: []
      }

      for (let i = -1; i < 8; i++) {

        let day = new Date(dateToday)
        day.setDate(day.getDate() - i)

        let count = Math.round(Math.random() * 20) + 1
        if (i > 0) {
          count += Math.round(Math.random() * 150)
        }

        vaccineStat.days.push({
          date: day.toISOString().substring(0,10),
          count: count
        })
      }

      stats.push(vaccineStat)
    }

    res.render('home/index', {
      stats,
      totalVaccinationsRecorded,
      totalVaccinationsRecordedToday,
      totalVaccinationsRecordedThisMonth,
      totalVaccinationsRecordedPast7Days,
      monthToday
    })
  })

  // Site-specific dashboard
  router.get('/home/:siteId', (req, res) => {

    const siteId = req.params.siteId
    const site = req.session.data.sites[siteId]
    const dateToday = new Date()
    const stats = []

    let vaccines = ["RSV", "Pertussis"]

    if (Math.random() > 0.5) { vaccines.push("Flu") }
    if (Math.random() > 0.5) { vaccines.push("Covid") }

    for (vaccine of vaccines) {

      let vaccineStat = {
        vaccine: vaccine,
        days: []
      }

      for (let i = -1; i < 8; i++) {

        let day = new Date(dateToday)
        day.setDate(day.getDate() - i)

        let count = Math.round(Math.random() * 5) + 1
        if (i > 0) {
          count += Math.round(Math.random() * 30)
        }

        vaccineStat.days.push({
          date: day.toISOString().substring(0,10),
          count: count
        })
      }

      stats.push(vaccineStat)
    }


    res.render('home/site', {
      site,
      siteId,
      stats
    })
  })
}
