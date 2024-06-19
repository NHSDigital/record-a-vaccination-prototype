module.exports = (config) => (req, res, next) => {
  res.locals.serviceName = config.serviceName;

  // Set currentUser for convenience
  res.locals.currentUser = req.session.data.users.find((user) => user.id === req.session.data.currentUserId);

  next();
};
