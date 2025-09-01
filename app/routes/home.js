module.exports = router => {

  // Dashboard
  router.get('/home', (req, res) => {
    const data = req.session.data
    const vaccinationsRecorded = data.vaccinationsRecorded

    let totalsBySite = []
    let totalsByVaccine = []
    let totalsByDay = []

    const dateToday = new Date()
    const dayToday = (dateToday.getDate())

    // Months in JavaScript are zero-indexed
    const monthToday = (dateToday.getMonth() + 1)
    const yearToday = (dateToday.getFullYear())

    const totalVaccinationsRecorded = vaccinationsRecorded.length

    const totalVaccinationsRecordedToday = vaccinationsRecorded.filter((vaccination) => {
      return (
        parseInt(vaccination.date.day) == dayToday &&
        parseInt(vaccination.date.month) == monthToday &&
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
        parseInt(vaccination.date.month) == monthToday &&
        parseInt(vaccination.date.year) == yearToday
      )
    }).length

    const organisationVaccines = res.locals.currentOrganisation.vaccines || []

    const vaccinesEnabledNames = organisationVaccines
      .filter((vaccine) => vaccine.status === "enabled")
      .map((vaccine) => vaccine.name)



    for (let i = 0; i < 7; i++) {

      let date = new Date()
      date.setUTCDate(dateToday.getUTCDate() - i)

      totalsByDay.push({
        day: date.toISOString(),
        value: vaccinationsRecorded.filter((vaccination) => {
          return (
            parseInt(vaccination.date.day) == date.getDate() &&
            parseInt(vaccination.date.month) == (date.getMonth() + 1) &&
            parseInt(vaccination.date.year) == date.getFullYear()
          )
        }).length

      })
    }


    let vaccines = vaccinesEnabledNames

    for (vaccine of vaccines) {
      totalsByVaccine.push({
        vaccine: vaccine
      })
    }

    // This is faked for now
    let siteIds = [...new Set(data.vaccineStock.map((vaccine) => vaccine.siteId))]

    for (siteId of siteIds) {
      totalsBySite.push({
        siteId: siteId
      })
    }


    res.render('home/index', {
      totalVaccinationsRecorded,
      totalVaccinationsRecordedToday,
      totalVaccinationsRecordedThisMonth,
      totalVaccinationsRecordedPast7Days,
      monthToday,
      totalsBySite,
      totalsByVaccine,
      totalsByDay
    })
  })
}
