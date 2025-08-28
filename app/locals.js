module.exports = (config) => (req, res, next) => {
  res.locals.serviceName = config.serviceName;

  // Set currentUser and currentOrganisation for convenience
  res.locals.currentUser = req.session.data.users.find((user) => user.id === req.session.data.currentUserId);

  // Set currentUser for convenience
  res.locals.currentOrganisation = req.session.data.organisations.find((organisation) => organisation.id === req.session.data.currentOrganisationId);

  // set current logged in region
  res.locals.currentRegion = req.session.data.regions.find((region) => region.id === req.session.data.currentRegionId);

  next();
};
