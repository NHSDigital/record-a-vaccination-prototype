// External dependencies
const express = require('express');

const router = express.Router();


// Inviting an organisation
router.post('/regions/v1/add', (req, res) => {

  req.session.data.organisationsAdded ||= [];

  const organisationCode = req.session.data.organisationCode
  // Add organisation to `organisationsAdded` array
  req.session.data.organisationsAdded.push({
    code: req.session.data.organisationCode,
    name: req.session.data.nhsTrusts[req.session.data.organisationCode],
    leadUsers: [
      {email: req.session.data.email}
    ]
  })

  // Remove data from adding organisation flow
  req.session.data.email = '';
  req.session.data.organisationCode = '';

  res.redirect('/regions/v1/organisations/' + organisationCode);

});

// Viewing an organisation
router.get('/regions/v1/organisations/:code', (req, res) => {

  const organisationsAdded = req.session.data.organisationsAdded || []
  const organisation = organisationsAdded.find((org) => org.code === req.params.code)

  res.render('regions/v1/organisation', {
    organisation
  });

});

module.exports = router;
