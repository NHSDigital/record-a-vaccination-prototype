module.exports = (router) => {

  router.get('/reports/choose-dates-2', (req, res) => {
    const data = req.session.data

    let dateError, dateFromError, dateToError
    let fromDate, toDate, daysApart

    if (data.from.year && data.from.month && data.from.day) {
      fromDate = new Date(data.from.year, data.from.month, data.from.day, 12)
    }

    if (data.to.year && data.to.month && data.to.day) {
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

    res.render('reports/choose-dates-2', {
      dateError,
      dateFromError,
      dateToError
    })

  })


  router.post('/reports/set-dates', (req, res) => {

    const data = req.session.data
    const date = data.date
    let fromDate, toDate, daysApart

    if (data.from.year && data.from.month && data.from.day) {
      fromDate = new Date(data.from.year, data.from.month, data.from.day, 12)
    }

    if (data.to.year && data.to.month && data.to.day) {
      toDate = new Date(data.to.year, data.to.month, data.to.day, 12)
    }

    if (fromDate && toDate) {
      daysApart = Math.floor((toDate.getTime() - fromDate.getTime()) / (1000 * 3600 * 24)) + 1
    }

    if (date === "custom_date_range") {

      if (fromDate && toDate && daysApart < 15) {
        res.redirect('/reports/choose-vaccines-2')
      } else {
        res.redirect('/reports/choose-dates-2?showErrors=true')
      }

    } else if (date) {
      res.redirect('/reports/choose-vaccines-2')
    } else {
      res.redirect('/reports/choose-dates-2?showErrors=true')
    }

  })

}