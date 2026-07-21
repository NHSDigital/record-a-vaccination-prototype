const filters = require('.././filters.js')()

module.exports = (router) => {

  router.get('/reports', (req, res) => {
    const data = req.session.data
    const currentOrganisation = res.locals.currentOrganisation
    let vaccinationsRecordedCount

    if (currentOrganisation.type === "Pharmacy HQ") {

      // TODO count vaccinations recorded at any pharmacies within this group.
      vaccinationsRecordedCount = 1

    } else {

      vaccinationsRecordedCount = data.vaccinationsRecorded.filter((vaccination) => vaccination.organisationId === currentOrganisation.id).length

    }

    res.render('reports/index', {
      vaccinationsRecordedCount
    })
  })

  router.get('/reports/choose-vaccines', (req, res) => {
    const data = req.session.data
    let enabledVaccines = []

    if (res.locals.currentOrganisation) {

      const organisationVaccines = res.locals.currentOrganisation.vaccines || []

      enabledVaccines = organisationVaccines.filter((vaccine) => vaccine.status === "enabled")
    }

      // Temporary: show all vaccines if none have batches adde
    if (enabledVaccines.length === 0) {
      enabledVaccines = data.vaccines
    }


    res.render('reports/choose-vaccines', {
      enabledVaccines
    })
  })

  router.post('/reports/choose-vaccines-answer', (req, res) => {
    const data = req.session.data
    const currentOrganisation = res.locals.currentOrganisation
    const sites = currentOrganisation.sites || []

    if (currentOrganisation.type === "Pharmacy HQ") {
      res.redirect('/reports/choose-pharmacies')
    } else if (sites.length === 1) {
      data.siteIdsToReport = [sites[0].id]
      res.redirect('/reports/choose-data')
    } else {
      res.redirect('/reports/choose-site')
    }

  })


  router.get('/reports/choose-dates', (req, res) => {
    const data = req.session.data

    let dateError, dateFromError, dateToError
    let fromDate, toDate, daysApart

    if (data.from?.year && data.from?.month && data.from?.day) {
      fromDate = new Date(data.from.year, data.from.month, data.from.day, 12)
    }

    if (data.to?.year && data.to?.month && data.to?.day) {
      toDate = new Date(data.to.year, data.to.month, data.to.day, 12)
    }

    if (fromDate && toDate) {
      daysApart = Math.floor((toDate.getTime() - fromDate.getTime()) / (1000 * 3600 * 24)) + 1
    }

    if (req.query.showErrors === "true") {

      if (!data.date) {
        dateError = "Select date"
      }

      if (data.date == "custom_date_range") {

        if (!data.from.day || !data.from.month || !data.from.year) {
          dateFromError = "Enter from date"
        }

        if (!data.to.day || !data.to.month || !data.to.year) {
          dateToError = "Enter to date"
        }

        if (daysApart > 14) {
          dateToError = "Date range must be within 2 weeks"
        }

      }
    }

    res.render('reports/choose-dates', {
      dateError,
      dateFromError,
      dateToError
    })

  })

  router.get('/reports/choose-site', (req, res) => {
    const data = req.session.data
    const currentOrganisation = res.locals.currentOrganisation

    const sites = currentOrganisation.sites || []

    if (sites.length === 1) {
      data.siteIdsToReport = [sites[0].id]
      res.redirect('/reports/choose-data')
      return
    }

    res.render('reports/choose-site', {
      sites
    })
  })

  router.get('/reports/choose-pharmacies', (req, res) => {
    const data = req.session.data
    const currentOrganisation = res.locals.currentOrganisation

    const pharmacies = data.organisations.filter((organisation) => organisation.companyId === currentOrganisation.id)

    res.render('reports/choose-pharmacies', {
      pharmacies
    })

  })


  router.post('/reports/set-dates', (req, res) => {

    const data = req.session.data
    const date = data.date
    let fromDate, toDate, daysApart

    if (data.from?.year && data.from?.month && data.from?.day) {
      fromDate = new Date(data.from.year, data.from.month, data.from.day, 12)
    }

    if (data.to?.year && data.to?.month && data.to?.day) {
      toDate = new Date(data.to.year, data.to.month, data.to.day, 12)
    }

    if (fromDate && toDate) {
      daysApart = Math.floor((toDate.getTime() - fromDate.getTime()) / (1000 * 3600 * 24)) + 1
    }

    if (date === "custom_date_range") {

      if (fromDate && toDate && daysApart < 15) {
        res.redirect('/reports/choose-vaccines')
      } else {
        res.redirect('/reports/choose-dates?showErrors=true')
      }

    } else if (date) {
      res.redirect('/reports/choose-vaccines')
    } else {
      res.redirect('/reports/choose-dates?showErrors=true')
    }

  })

  router.post('/reports/update-data', (req, res) => {

    const dataSelected = req.session.data.data || []

    if (dataSelected.length > 0) {
      res.redirect('/reports/check')
    } else {

      const error = {
        text: "Select the data you want to include",
        href: "#data-1"
      }

      res.render('reports/choose-data', {
        error
      })
    }

  })


  router.get('/reports/check', (req, res) => {
    const data = req.session.data
    const currentOrganisation = res.locals.currentOrganisation
    const siteIds = data.siteIdsToReport || []
    const selectedVaccines = data.vaccinesToReport || []
    const today = new Date()
    const days = 86400000 // number of milliseconds in a day

    const pharmacyIdsToReport = data.pharmacyIdsToReport || []
    const allSites = currentOrganisation.sites || []
    const allSitesSelected = siteIds.includes('all')
    const allPharmacies = data.organisations
      .filter((organisation) => organisation.companyId === currentOrganisation.id)
    const allPharmaciesSelected = pharmacyIdsToReport.includes('all')
    const allVaccinesSelected = selectedVaccines.includes('all')

    let sites, pharmacies

    sites = allSitesSelected
      ? allSites
      : allSites.filter((site) => siteIds.includes(site.id))

    pharmacies = allPharmaciesSelected
      ? allPharmacies
      : allPharmacies.filter((pharmacy) => pharmacyIdsToReport.includes(pharmacy.id))

    const fromInput = data.from
    const toInput = data.to
    const dateOption = data.date

    let from, to
    let vaccinesToReportDisplay = selectedVaccines.filter((vaccineName) => vaccineName !== 'all')

    if (allVaccinesSelected) {
      const organisationVaccines = currentOrganisation.vaccines || []
      let enabledVaccines = organisationVaccines.filter((vaccine) => vaccine.status === "enabled")

      // Temporary: show all vaccines if none have batches added
      if (enabledVaccines.length === 0) {
        enabledVaccines = data.vaccines
      }

      vaccinesToReportDisplay = enabledVaccines.map((vaccine) => vaccine.name)
    }

    vaccinesToReportDisplay = [...new Set(vaccinesToReportDisplay)]
      .sort((a, b) => a.localeCompare(b))

    switch (dateOption) {
      case 'custom_date_range':
        from = filters.isoDateFromDateInput(fromInput)
        to = filters.isoDateFromDateInput(toInput)
        break
      case 'Today':
        from = today.toISOString().substring(0,10)
        to = today.toISOString().substring(0,10)
        break
      case 'Yesterday':
        from = new Date(today.getTime() - (1 * days)).toISOString().substring(0,10)
        to = new Date(today.getTime() - (1 * days)).toISOString().substring(0,10)
        break
      case 'LastCalendarWeek': {
        const dayOfWeek = today.getDay() // 0 = Sunday, 1 = Monday, ...
        const daysSinceMonday = (dayOfWeek === 0 ? 7 : dayOfWeek) - 1
        const lastMonday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - daysSinceMonday - 7)
        const lastSunday = new Date(lastMonday.getTime() + (6 * days))

        from = lastMonday.toISOString().substring(0,10)
        to = lastSunday.toISOString().substring(0,10)
        break
      }
      case 'LastCalendarMonth': {
        const firstDayOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1)
        const firstDayOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
        const lastDayOfLastMonth = new Date(firstDayOfThisMonth.getTime() - days)

        from = firstDayOfLastMonth.toISOString().substring(0,10)
        to = lastDayOfLastMonth.toISOString().substring(0,10)
        break
      }
    }



    res.render('reports/check', {
      sites,
      pharmacies,
      allSitesSelected,
      allPharmaciesSelected,
      allVaccinesSelected,
      from,
      to,
      vaccinesToReportDisplay
    })

  })

  router.post('/reports/download', (req, res) => {
    const data = req.session.data

    // Reset values
    data.siteIdsToReport = null
    data.from = null
    data.to = null
    data.vaccinesToReport = null


    res.redirect('/reports/creating-report')
  })

}
