module.exports = function(req, res, next) {
  // Set currentUser and currentOrganisation for convenience
  res.locals.currentUser = req.session.data.users.find((user) => user.id === req.session.data.currentUserId);

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
  res.locals.currentRegion = req.session.data.regions.find((region) => region.id === req.session.data.currentRegionId);

  next()
}

