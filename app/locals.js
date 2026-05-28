module.exports = function(req, res, next) {

    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ]

    const dashboardUpdatedAt = new Date(Date.now() - (30 * 60 * 1000))
    const hours24 = dashboardUpdatedAt.getHours()
    const hours12 = (hours24 % 12) || 12
    const minutes = String(dashboardUpdatedAt.getMinutes()).padStart(2, '0')
    const amPm = hours24 >= 12 ? 'pm' : 'am'

    res.locals.dashboardLastUpdated = `${dashboardUpdatedAt.getDate()} ${monthNames[dashboardUpdatedAt.getMonth()]} ${dashboardUpdatedAt.getFullYear()}, ${hours12}:${minutes}${amPm}`

    // Set currentUser for convenience
    if (req.session.data.currentUserId) {
      res.locals.currentUser = req.session.data.users.find((user) => user.id === req.session.data.currentUserId)
    } else {
      res.locals.currentUser = null
    }
    // Set currentOrganisation for convenience
    if (req.session.data.currentOrganisationId) {
      res.locals.currentOrganisation = req.session.data.organisations.find((organisation) => organisation.id === req.session.data.currentOrganisationId)
    } else {
      res.locals.currentOrganisation = null
    }

  // set current logged in region
  // res.locals.currentRegion = req.session.data.regions.find((region) => region.id === req.session.data.currentRegionId);

  next()
}

