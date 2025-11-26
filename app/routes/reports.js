const filters = require('.././filters.js')()

module.exports = (router) => {

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
    const currentUser = res.locals.currentUser
    const vaccineStock = data.vaccineStock

    let sites = []

    if (currentOrganisation) {

      const siteIdsWithVaccines = [...new Set(vaccineStock.map((vaccineAdded) => vaccineAdded.siteId))]

      const sitesInUse = (currentOrganisation.sites || []).filter((site) => siteIdsWithVaccines.includes(site.id))

      sites = sitesInUse

      if (sites === []) {
        sites = [currentOrganisation]
      }

    } else {

      const userOrganisationIds = currentUser.organisations.map((organisation) => organisation.id)
      const organisations = data.organisations.filter((organisation) => userOrganisationIds.includes(organisation.id) )

      sites = organisations
    }

    res.render('reports/choose-site', {
      sites
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
        text: "Select data for report",
        href: "#data-1"
      }

      res.render('reports/choose-data', {
        error
      })
    }

  })


  router.get('/reports/check', (req, res) => {
    const currentOrganisation = res.locals.currentOrganisation
    const data = req.session.data
    const siteIds = data.siteIdsToReport || []
    const today = new Date()
    const days = 86400000 // number of milliseconds in a day

    let sites = []

    if (currentOrganisation) {
      sites = (currentOrganisation.sites || []).filter((site) => siteIds.includes(site.id))
    } else {
      sites = data.organisations.filter((organisation) => siteIds.includes(organisation.id))
    }


    const fromInput = data.from
    const toInput = data.to
    const dateOption = data.date

    let from, to

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
      case 'Last7days':
        from = new Date(today.getTime() - (7 * days)).toISOString().substring(0,10)
        to = today.toISOString().substring(0,10)
        break
      case 'Last14days':
        from = new Date(today.getTime() - (14 * days)).toISOString().substring(0,10)
        to = today.toISOString().substring(0,10)
        break
      case 'Last31days':
        from = new Date(today.getTime() - (31 * days)).toISOString().substring(0,10)
        to = today.toISOString().substring(0,10)
        break
    }



    res.render('reports/check', {
      sites,
      from,
      to
    })

  })

}
