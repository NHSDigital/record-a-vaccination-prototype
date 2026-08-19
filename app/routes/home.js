module.exports = router => {

  // This is a helper function used for calculating the number of vaccinations
  // recorded, with various options for filtering it.
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

    if (filters.siteId) {
      vaccinations = vaccinations.filter((vaccination) => {
        return (vaccination.siteId === filters.siteId)
      })
    }

    if (filters.organisationId) {
      vaccinations = vaccinations.filter((vaccination) => {
        return (vaccination.organisationId === filters.organisationId)
      })
    }

    if (filters.vaccine) {
      vaccinations = vaccinations.filter((vaccination) => {
        return (vaccination.vaccine === filters.vaccine)
      })
    }

    return vaccinations.length
  }

  // Dashboard
  router.get('/home', (req, res) => {
    const currentOrganisation = res.locals.currentOrganisation

    const data = req.session.data
    const allVaccinationsRecorded = data.vaccinationsRecorded
    const simulatedDateParam = req.query.simulatedDate
    const simulatedDateMatch = (typeof simulatedDateParam === 'string')
      ? simulatedDateParam.match(/^(\d{4})-(\d{2})-(\d{2})$/)
      : null

    const dateToday = simulatedDateMatch
      ? new Date(Date.UTC(
        parseInt(simulatedDateMatch[1]),
        parseInt(simulatedDateMatch[2]) - 1,
        parseInt(simulatedDateMatch[3]),
        0,
        0,
        0
      ))
      : new Date()

    const dateYesterday = new Date(dateToday)
    dateYesterday.setDate(dateToday.getDate() - 1)

    const startOfThisWeek = new Date(Date.UTC(
      dateToday.getUTCFullYear(),
      dateToday.getUTCMonth(),
      dateToday.getUTCDate() - ((dateToday.getUTCDay() + 6) % 7),
      0,
      0,
      0
    ))
    const startOfLastCalendarWeek = new Date(startOfThisWeek)
    startOfLastCalendarWeek.setUTCDate(startOfThisWeek.getUTCDate() - 7)
    const endOfLastCalendarWeek = new Date(startOfThisWeek)
    endOfLastCalendarWeek.setUTCDate(startOfThisWeek.getUTCDate() - 1)
    endOfLastCalendarWeek.setUTCHours(23, 59, 59, 999)

    const monthNameFormatter = new Intl.DateTimeFormat('en-GB', {
      month: 'long',
      timeZone: 'UTC'
    })
    const shortMonthNameFormatter = new Intl.DateTimeFormat('en-GB', {
      month: 'short',
      timeZone: 'UTC'
    })
    const lastCalendarWeekStartDay = startOfLastCalendarWeek.getUTCDate()
    const lastCalendarWeekEndDay = endOfLastCalendarWeek.getUTCDate()
    const lastCalendarWeekEndMonth = monthNameFormatter.format(endOfLastCalendarWeek)
    const lastCalendarWeekStartMonthShort = shortMonthNameFormatter.format(startOfLastCalendarWeek)
    const lastCalendarWeekEndMonthShort = shortMonthNameFormatter.format(endOfLastCalendarWeek)
    const isLastCalendarWeekInSameMonth = (
      startOfLastCalendarWeek.getUTCMonth() === endOfLastCalendarWeek.getUTCMonth() &&
      startOfLastCalendarWeek.getUTCFullYear() === endOfLastCalendarWeek.getUTCFullYear()
    )

    const lastCalendarWeekRangeLabel = isLastCalendarWeekInSameMonth
      ? `${lastCalendarWeekStartDay} to ${lastCalendarWeekEndDay} ${lastCalendarWeekEndMonth}`
      : `${lastCalendarWeekStartDay} ${lastCalendarWeekStartMonthShort} to ${lastCalendarWeekEndDay} ${lastCalendarWeekEndMonthShort}`

    const lastCalendarWeekHeaderLineOne = isLastCalendarWeekInSameMonth
      ? `${lastCalendarWeekStartDay} to ${lastCalendarWeekEndDay}`
      : `${lastCalendarWeekStartDay} ${lastCalendarWeekStartMonthShort} to`

    const lastCalendarWeekHeaderLineTwo = isLastCalendarWeekInSameMonth
      ? lastCalendarWeekEndMonth
      : `${lastCalendarWeekEndDay} ${lastCalendarWeekEndMonthShort}`

    const startOfThisMonth = new Date(Date.UTC(
      dateToday.getUTCFullYear(),
      dateToday.getUTCMonth(),
      1,
      0,
      0,
      0
    ))
    const startOfLastCalendarMonth = new Date(Date.UTC(
      startOfThisMonth.getUTCFullYear(),
      startOfThisMonth.getUTCMonth() - 1,
      1,
      0,
      0,
      0
    ))
    const endOfLastCalendarMonth = new Date(startOfThisMonth)
    endOfLastCalendarMonth.setUTCDate(0)
    endOfLastCalendarMonth.setUTCHours(23, 59, 59, 999)

    const monthToday = (dateToday.getMonth() + 1) // JavaScript dates are 0-indexed
    const currentYear = dateToday.getFullYear()
    const lastCalendarMonth = (startOfLastCalendarMonth.getMonth() + 1)
    const lastCalendarMonthYear = startOfLastCalendarMonth.getFullYear()

    // Vaccinations to count
    let vaccinationsRecorded = []
    let sites = []
    let pharmacies = []

    if (currentOrganisation) {

      if (currentOrganisation.type == "Pharmacy HQ") {

        pharmacies = data.organisations.filter((organisation) => organisation.companyId === currentOrganisation.id)

        vaccinationsRecorded = allVaccinationsRecorded



      } else {

        // Showing all sites for now, for demo purposes
        sites = currentOrganisation.sites || []

        // Filter vaccinations to only those recorded by the current
        // organisation
        vaccinationsRecorded = allVaccinationsRecorded.filter((vaccination)=> vaccination.organisationId === currentOrganisation.id)

        if (!sites.length || sites.length === 0) {
          sites = [currentOrganisation]
        }
      }
    }

    let totalsBySite = []
    let totalsByPharmacy = []
    let totalsByVaccine = []
    let totalsByDay = []

    const selectedSiteIdFromQuery = req.query.siteId
    const hasMultipleVisibleSites = sites.length > 1
    const selectedByVaccinationSiteId = (
      hasMultipleVisibleSites &&
      selectedSiteIdFromQuery &&
      sites.some((site) => site.id === selectedSiteIdFromQuery)
    )
      ? selectedSiteIdFromQuery
      : 'all'

    const vaccinationsRecordedForByVaccine = (selectedByVaccinationSiteId === 'all')
      ? vaccinationsRecorded
      : vaccinationsRecorded.filter((vaccination) => vaccination.siteId === selectedByVaccinationSiteId)

    const totalVaccinationsRecorded = countVaccinations(vaccinationsRecorded)

    const totalVaccinationsRecordedToday = countVaccinations(
      vaccinationsRecorded,
      {date: dateToday}
    )

    const totalVaccinationsRecordedYesterday = countVaccinations(
      vaccinationsRecorded,
      {date: dateYesterday}
    )

    const sevenDaysAgo = new Date(Date.UTC(dateToday.getFullYear(), dateToday.getMonth(), dateToday.getDate() - 7, 0, 0, 0));

    const totalVaccinationsRecordedPast7Days = countVaccinations(
      vaccinationsRecorded,
      {minDate: sevenDaysAgo, maxDate: dateToday}
    )

    const totalVaccinationsRecordedThisMonth = countVaccinations(vaccinationsRecorded, {
      month: dateToday
    })

    const totalVaccinationsRecordedLastCalendarWeek = countVaccinations(
      vaccinationsRecorded,
      {
        // Range counting uses > minDate and <= maxDate, so move minDate back one day
        // to include all vaccinations on the start date.
        minDate: new Date(Date.UTC(
          startOfLastCalendarWeek.getUTCFullYear(),
          startOfLastCalendarWeek.getUTCMonth(),
          startOfLastCalendarWeek.getUTCDate() - 1,
          0,
          0,
          0
        )),
        maxDate: endOfLastCalendarWeek
      }
    )

    const uniqueVaccinesRecorded = [...new Set(vaccinationsRecordedForByVaccine.map((vaccination) => vaccination.vaccine))]

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

    for (let vaccine of uniqueVaccinesRecorded) {

      totalsByVaccine.push({
        vaccine: vaccine,
        today: countVaccinations(vaccinationsRecordedForByVaccine, {
          date: dateToday,
          vaccine: vaccine
        }),
        yesterday: countVaccinations(vaccinationsRecordedForByVaccine, {
          date: dateYesterday,
          vaccine: vaccine
        }),
        lastCalendarWeek: countVaccinations(vaccinationsRecordedForByVaccine, {
          minDate: new Date(Date.UTC(
            startOfLastCalendarWeek.getUTCFullYear(),
            startOfLastCalendarWeek.getUTCMonth(),
            startOfLastCalendarWeek.getUTCDate() - 1,
            0,
            0,
            0
          )),
          maxDate: endOfLastCalendarWeek,
          vaccine: vaccine
        }),
        lastCalendarMonth: countVaccinations(vaccinationsRecordedForByVaccine, {
          minDate: new Date(Date.UTC(
            startOfLastCalendarMonth.getUTCFullYear(),
            startOfLastCalendarMonth.getUTCMonth(),
            startOfLastCalendarMonth.getUTCDate() - 1,
            0,
            0,
            0
          )),
          maxDate: endOfLastCalendarMonth,
          vaccine: vaccine
        }),
        thisMonth: countVaccinations(vaccinationsRecordedForByVaccine, {
          month: dateToday,
          vaccine: vaccine
        }),
        past7Days: countVaccinations(vaccinationsRecorded, {
          minDate: sevenDaysAgo,
          maxDate: dateToday,
          vaccine: vaccine
        }),
        total: countVaccinations(vaccinationsRecorded, {
          vaccine: vaccine
        })
      })
    }

    for (let site of sites) {

      const total = countVaccinations(vaccinationsRecorded, {
        siteId: site.id
      })

      if (total > 0) {
        totalsBySite.push({
          siteId: site.id,
          siteName: site.name,
          today: countVaccinations(vaccinationsRecorded, {
            date: dateToday,
            siteId: site.id
          }),
          yesterday: countVaccinations(vaccinationsRecorded, {
            date: dateYesterday,
            siteId: site.id
          }),
          lastCalendarWeek: countVaccinations(vaccinationsRecorded, {
            minDate: new Date(Date.UTC(
              startOfLastCalendarWeek.getUTCFullYear(),
              startOfLastCalendarWeek.getUTCMonth(),
              startOfLastCalendarWeek.getUTCDate() - 1,
              0,
              0,
              0
            )),
            maxDate: endOfLastCalendarWeek,
            siteId: site.id
          }),
          lastCalendarMonth: countVaccinations(vaccinationsRecorded, {
            minDate: new Date(Date.UTC(
              startOfLastCalendarMonth.getUTCFullYear(),
              startOfLastCalendarMonth.getUTCMonth(),
              startOfLastCalendarMonth.getUTCDate() - 1,
              0,
              0,
              0
            )),
            maxDate: endOfLastCalendarMonth,
            siteId: site.id
          }),
          thisMonth: countVaccinations(vaccinationsRecorded, {
            month: dateToday,
            siteId: site.id
          }),
          total: total
        })
      }
    }

    for (let pharmacy of pharmacies) {

      const total = countVaccinations(vaccinationsRecorded, {
        organisationId: pharmacy.id
      })

      if (total !== -1) {
        totalsByPharmacy.push({
          organisationId: pharmacy.id,
          organisationName: pharmacy.name,
          today: countVaccinations(vaccinationsRecorded, {
            date: dateToday,
            organisationId: pharmacy.id
          }),
          month:countVaccinations(vaccinationsRecorded, {
            month: dateToday,
            organisationId: pharmacy.id
          }),
          past7Days: countVaccinations(vaccinationsRecorded, {
            minDate: sevenDaysAgo,
            maxDate: dateToday,
            organisationId: pharmacy.id
          }),
          total: total
        })
      }
    }

    res.render('dashboard/index', {
      sites,
      pharmacies,
      selectedByVaccinationSiteId,
      totalVaccinationsRecorded,
      totalVaccinationsRecordedToday,
      totalVaccinationsRecordedYesterday,
      totalVaccinationsRecordedThisMonth,
      totalVaccinationsRecordedLastCalendarWeek,
      totalVaccinationsRecordedPast7Days,
      monthToday,
      currentYear,
      lastCalendarWeekRangeLabel,
      lastCalendarWeekHeaderLineOne,
      lastCalendarWeekHeaderLineTwo,
      lastCalendarMonth,
      lastCalendarMonthYear,
      totalsBySite,
      totalsByVaccine,
      totalsByDay,
      totalsByPharmacy
    })
  })
}
