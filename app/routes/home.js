module.exports = router => {

  const countVaccinations = function(allVaccinations, filters = {}) {

    let vaccinations = JSON.parse(JSON.stringify(allVaccinations))

    if (filters.date) {
      vaccinations = vaccinations.filter((vaccination) => {
        return (
          parseInt(vaccination.date.day) == filters.date.getDate() &&
          parseInt(vaccination.date.month) == (filters.date.getMonth() + 1) &&
          parseInt(vaccination.date.year) == filters.date.getFullYear()
        )
      })
    }

    if (filters.month) {
      vaccinations = vaccinations.filter((vaccination) => {
        return (
          parseInt(vaccination.date.month) == (filters.month.getMonth() + 1) &&
          parseInt(vaccination.date.year) == filters.month.getFullYear()
        )
      })
    }

    if (filters.minDate && filters.maxDate) {
      vaccinations = vaccinations.filter((vaccination) => {

        const vaccinationYear = parseInt(vaccination.date.year)
        const vaccinationMonth = parseInt(vaccination.date.month)
        const vaccinationDay = parseInt(vaccination.date.day)
        const vaccinationDate = new Date(Date.UTC(vaccinationYear, (vaccinationMonth - 1), vaccinationDay, 0, 0, 0));

        return (
          vaccinationDate.getTime() > filters.minDate.getTime() &&
          vaccinationDate.getTime() <= (filters.maxDate.getTime())
        )
      })
    }

    return vaccinations.length
  }

  // Dashboard
  router.get('/home', (req, res) => {
    const data = req.session.data
    const vaccinationsRecorded = data.vaccinationsRecorded
    const dateToday = new Date()
    const monthToday = (dateToday.getMonth() + 1) // JavaScript dates are 0-indexed

    let totalsBySite = []
    let totalsByVaccine = []
    let totalsByDay = []

    const totalVaccinationsRecorded = countVaccinations(vaccinationsRecorded)

    const totalVaccinationsRecordedToday = countVaccinations(
      vaccinationsRecorded,
      {date: dateToday}
    )

    const sevenDaysAgo = new Date(Date.UTC(dateToday.getFullYear(), dateToday.getMonth(), dateToday.getDate() - 7, 0, 0, 0));

    const totalVaccinationsRecordedPast7Days = countVaccinations(
      vaccinationsRecorded,
      {minDate: sevenDaysAgo, maxDate: dateToday}
    )

    const totalVaccinationsRecordedThisMonth = countVaccinations(vaccinationsRecorded, {
      month: dateToday
    })

    const organisationVaccines = res.locals.currentOrganisation.vaccines || []

    const vaccinesEnabledNames = organisationVaccines
      .filter((vaccine) => vaccine.status === "enabled")
      .map((vaccine) => vaccine.name)


    for (let i = 0; i < 7; i++) {

      let date = new Date()
      date.setUTCDate(dateToday.getUTCDate() - i)

      totalsByDay.push({
        day: date.toISOString(),
        value: countVaccinations(vaccinationsRecorded, {
          date: date
        })
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
