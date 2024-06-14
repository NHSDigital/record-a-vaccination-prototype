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

// Inviting a second lead user for an organisation
router.post('/regions/v1/organisations/:code/add', (req, res) => {

  const organisationsAdded = req.session.data.organisationsAdded || []
  const organisation = organisationsAdded.find((org) => org.code === req.params.code)

  organisation.leadUsers.push({ email: req.session.data.email })

  // Remove data from adding organisation flow
  req.session.data.email = '';

  res.redirect('/regions/v1/organisations/' + organisation.code);

});

// Viewing an organisation
router.get('/regions/v1/organisations/:code', (req, res) => {

  const organisationsAdded = req.session.data.organisationsAdded || []
  const organisation = organisationsAdded.find((org) => org.code === req.params.code)

  res.render('regions/v1/organisation', {
    organisation
  });

});

// Add another lead user to an organisation form
router.get('/regions/v1/organisations/:code/add-email', (req, res) => {

  const organisationsAdded = req.session.data.organisationsAdded || []
  const organisation = organisationsAdded.find((org) => org.code === req.params.code)

  res.render('regions/v1/add-another-email', {
    organisation
  });

});

// Check a second lead user for an organisation
router.get('/regions/v1/organisations/:code/add-email-check', (req, res) => {

  const organisationsAdded = req.session.data.organisationsAdded || []
  const organisation = organisationsAdded.find((org) => org.code === req.params.code)

  res.render('regions/v1/add-another-email-check', {
    organisation
  });

});


// USER ADMIN

// Adding a user
router.post('/user-admin/v1/add', (req, res) => {


  req.session.data.users.push({
    firstName: req.session.data.firstName,
    lastName: req.session.data.lastName,
    email: req.session.data.email,
    role: req.session.data.role,
    status: 'Invited'
  })

  // Reset data
  req.session.data.email = '';
  req.session.data.firstName = '';
  req.session.data.lastName = '';
  req.session.data.role = '';

  res.redirect('/user-admin/v1');

});

// Adding a user - v2
router.post('/user-admin/v2/add', (req, res) => {


  req.session.data.users.push({
    firstName: req.session.data.firstName,
    lastName: req.session.data.lastName,
    email: req.session.data.email,
    role: req.session.data.role,
    status: 'Invited'
  })

  // Reset data
  req.session.data.email = '';
  req.session.data.firstName = '';
  req.session.data.lastName = '';
  req.session.data.role = '';

  res.redirect('/user-admin/v2');

});


// Answering whether the user has a Care Identity account or not
router.post('/user-onboarding/v1/cis2-answer', (req, res) => {

  const answer = req.body.existingCareIdentityAccount;

  if (answer === 'yes') {
    res.redirect('/user-onboarding/v1/cis2-setup');
  } else if (answer === 'no') {
    res.redirect('/user-onboarding/v1/cis2-alternative');
  } else if (answer === 'not-sure') {
    res.redirect('/user-onboarding/v1/cis2-not-sure');
  } else {
    res.redirect('/user-onboarding/v1/setup');
  }

});

// Answering type of authentication method
router.post('/user-onboarding/v1/cis2-method-answer', (req, res) => {

  const answer = req.body.cis2Method;

  if (answer === 'smartcard') {
    res.redirect('/user-onboarding/v1/cis2-smartcard');
  } else if (answer === 'windowsHello') {
    res.redirect('/user-onboarding/v1/cis2-windows-hello');
  } else if (answer === 'securityKey') {
    res.redirect('/user-onboarding/v1/cis2-security-key');
  }  else if (answer === 'ipadapp') {
    res.redirect('/user-onboarding/v1/cis2-ipad-app');
  } else {
    res.redirect('/user-onboarding/v1/cis2-auth-method');
  }

});


module.exports = router;
