module.exports = function(req, res, next) {

    const buildSwitchedPharmacyOrganisationSetting = (sessionData, currentOrganisationId) => {
      if (!sessionData.previousOrganisationId || !currentOrganisationId) {
        return null
      }

      return {
        id: currentOrganisationId,
        status: 'Active',
        permissionLevel: 'Lead administrator',
        vaccinator: false
      }
    }

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

    const now = new Date()
    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    res.locals.lastCalendarMonth = `${monthNames[lastMonthDate.getMonth()]} ${lastMonthDate.getFullYear()}`

    const dayOfWeek = now.getDay() // 0 = Sunday, 1 = Monday
    const daysSinceMonday = (dayOfWeek === 0 ? 7 : dayOfWeek) - 1
    const lastMonday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysSinceMonday - 7)
    const lastSunday = new Date(lastMonday.getFullYear(), lastMonday.getMonth(), lastMonday.getDate() + 6)
    const formatWeekDay = (d) => {
      const suffix = d.getDate() === lastSunday.getDate() && d.getMonth() === lastSunday.getMonth() ? ` ${monthNames[d.getMonth()]} ${d.getFullYear()}` : (d.getMonth() !== lastSunday.getMonth() ? ` ${monthNames[d.getMonth()]}` : '')
      return `${d.getDate()}${suffix}`
    }
    res.locals.lastCalendarWeek = `${formatWeekDay(lastMonday)} to ${lastSunday.getDate()} ${monthNames[lastSunday.getMonth()]} ${lastSunday.getFullYear()}`

    const dashboardUpdatedAt = new Date(Date.now() - (30 * 60 * 1000))
    const hours24 = dashboardUpdatedAt.getHours()
    const hours12 = (hours24 % 12) || 12
    const minutes = String(dashboardUpdatedAt.getMinutes()).padStart(2, '0')
    const amPm = hours24 >= 12 ? 'pm' : 'am'

    res.locals.dashboardLastUpdated = `${dashboardUpdatedAt.getDate()} ${monthNames[dashboardUpdatedAt.getMonth()]} ${dashboardUpdatedAt.getFullYear()}, ${hours12}:${minutes}${amPm}`

    // Set currentUser for convenience
    if (req.session.data.currentUserId) {
      const sessionUser = req.session.data.users.find((user) => user.id === req.session.data.currentUserId)
      const switchedOrganisationSetting = buildSwitchedPharmacyOrganisationSetting(
        req.session.data,
        req.session.data.currentOrganisationId
      )

      if (sessionUser && switchedOrganisationSetting) {
        const userOrganisations = (sessionUser.organisations || [])
          .filter((organisation) => organisation.id !== switchedOrganisationSetting.id)
          .map((organisation) => ({ ...organisation }))

        res.locals.currentUser = {
          ...sessionUser,
          organisations: [...userOrganisations, switchedOrganisationSetting]
        }
      } else {
        res.locals.currentUser = sessionUser
      }
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

