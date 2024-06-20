// External dependencies
const express = require('express');

const router = express.Router();


// Inviting an organisation
router.post('/regions/v1/add', (req, res) => {



  req.session.data.organisationsAdded ||= [];

  const organisationCode = req.session.data.organisationCode

  if (organisationCode.startsWith('FA')) {
    organisationName = req.session.data.nhsPharmacies[organisationCode].name;
    organisationLine1 = req.session.data.nhsPharmacies[organisationCode].address;
    organisationTown = req.session.data.nhsPharmacies[organisationCode].town;
    organisationPostcode = req.session.data.nhsPharmacies[organisationCode].postcode;
    organisationType = 'Community Pharmacy';
  } else {
    organisationName = req.session.data.nhsTrusts[organisationCode];
    organisationLine1 = '73 Roman Rd';
    organisationTown = 'Leeds';
    organisationPostcode = 'LS2 5ZN';
    organisationType = 'NHS Trust';

  }

  // Add organisation to `organisationsAdded` array
  req.session.data.organisationsAdded.push({
    code: req.session.data.organisationCode,
    name: organisationName,
    address: {
      line1: organisationLine1,
      town: organisationTown,
      postcode: organisationPostcode
    },
    type: organisationType,
    leadUsers: [
      { email: req.session.data.email, status: 'Invited' }
    ],
    status: 'Invited'
  })

  // Remove data from adding organisation flow
  req.session.data.email = '';
  req.session.data.organisationCode = '';

  res.redirect('/regions/v1/organisations/' + organisationCode);

});

router.get('/regions/v1/organisation-details', (req, res) => {

  const organisationCode = req.session.data.organisationCode;

  if (organisationCode.startsWith('FA')) {
    organisationName = req.session.data.nhsPharmacies[organisationCode].name;
    organisationLine1 = req.session.data.nhsPharmacies[organisationCode].address;
    organisationTown = req.session.data.nhsPharmacies[organisationCode].town;
    organisationPostcode = req.session.data.nhsPharmacies[organisationCode].postcode;
    organisationType = 'Community Pharmacy';
  } else {
    organisationName = req.session.data.nhsTrusts[organisationCode];
    organisationLine1 = '73 Roman Rd';
    organisationTown = 'Leeds';
    organisationPostcode = 'LS2 5ZN';
    organisationType = 'NHS Trust';

  }

  const organisation = {
    code: organisationCode,
    name: organisationName,
    type: organisationType,
    address: {
      line1: organisationLine1,
      town: organisationTown,
      postcode: organisationPostcode
    }
  }

  res.render('regions/v1/organisation-details', {
    organisation
  });
})


router.get('/regions/v1/add-email', (req, res) => {

  const organisationCode = req.session.data.organisationCode;

  if (organisationCode.startsWith('FA')) {
    organisationName = req.session.data.nhsPharmacies[organisationCode].name;
    organisationLine1 = req.session.data.nhsPharmacies[organisationCode].address;
    organisationTown = req.session.data.nhsPharmacies[organisationCode].town;
    organisationPostcode = req.session.data.nhsPharmacies[organisationCode].postcode;
    organisationType = 'Community Pharmacy';
  } else {
    organisationName = req.session.data.nhsTrusts[organisationCode];
    organisationLine1 = '73 Roman Rd';
    organisationTown = 'Leeds';
    organisationPostcode = 'LS2 5ZN';
    organisationType = 'NHS Trust';

  }

  const organisation = {
    code: organisationCode,
    name: organisationName,
    type: organisationType,
    address: {
      line1: organisationLine1,
      town: organisationTown,
      postcode: organisationPostcode
    }
  }

  res.render('regions/v1/add-email', {
    organisation
  });
})

router.get('/regions/v1/check-and-send', (req, res) => {

  const organisationCode = req.session.data.organisationCode;

  if (organisationCode.startsWith('FA')) {
    organisationName = req.session.data.nhsPharmacies[organisationCode].name;
    organisationLine1 = req.session.data.nhsPharmacies[organisationCode].address;
    organisationTown = req.session.data.nhsPharmacies[organisationCode].town;
    organisationPostcode = req.session.data.nhsPharmacies[organisationCode].postcode;
    organisationType = 'Community Pharmacy';
  } else {
    organisationName = req.session.data.nhsTrusts[organisationCode];
    organisationLine1 = '73 Roman Rd';
    organisationTown = 'Leeds';
    organisationPostcode = 'LS2 5ZN';
    organisationType = 'NHS Trust';

  }

  const organisation = {
    code: organisationCode,
    name: organisationName,
    type: organisationType,
    address: {
      line1: organisationLine1,
      town: organisationTown,
      postcode: organisationPostcode
    }
  }

  res.render('regions/v1/check-and-send', {
    organisation
  });
})


// Inviting a second lead user for an organisation
router.post('/regions/v1/organisations/:code/add', (req, res) => {

  const organisationsAdded = req.session.data.organisationsAdded || []
  const organisation = organisationsAdded.find((org) => org.code === req.params.code)

  organisation.leadUsers.push({ email: req.session.data.email, status: 'Invited' })

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

// Mock up more organisations having been added
router.get('/regions/v1/setup-test', (req, res) => {

  req.session.data.organisationsAdded ||= [];

  // Add an NHS Trust
  req.session.data.organisationsAdded.push({
    code: 'RD8',
    name: 'Milton Keynes University Hospital NHS Foundation Trust',
    address: {
      line1: 'Standing Way, Eaglestone',
      town: 'Milton Keynes',
      postcode: 'MK6 5LD'
    },
    type: 'NHS Trust',
    status: 'Awaiting contract',
    leadUsers: [
      {email: 'sarah.jane@mk.nhs.net', status: 'Active'}
    ]
  })

  // Add another NHS Trust
  req.session.data.organisationsAdded.push({
    code: 'RAJ',
    name: 'Mid and South Essex NHS Foundation Trust',
    address: {
      line1: 'Prittlewell Chase',
      town: 'Westcliffe-on-Sea',
      postcode: 'SS0 0RY'
    },
    type: 'NHS Trust',
    status: 'Awaiting contract',
    leadUsers: [
      {email: 'richard.jones@mid-essex.nhs.net', status: 'Active'}
    ]
  })

  // Add another NHS Trust
  req.session.data.organisationsAdded.push({
    code: 'FA424',
    name: 'Pickfords Pharmacy',
    address: {
      line1: '8 Spencer Court',
      town: 'Corby',
      postcode: 'NN17 1NU'
    },
    type: 'Community Pharmacy',
    status: 'Awaiting contract',
    leadUsers: [
      {email: 'sara.pickford@pickford-pharmacy.com', status: 'Active'}
    ]
  })

  res.redirect('/regions/v1');
});


// Check a second lead user for an organisation
router.post('/regions/v1/organisations/:code/answer-activate', (req, res) => {

  const organisationsAdded = req.session.data.organisationsAdded || []
  const organisation = organisationsAdded.find((org) => org.code === req.params.code)

  if (req.body.activate == 'yes') {
    organisation.status = 'Active'
    res.redirect('/regions/v1/organisations/' + organisation.code + '?justactivated=yes')

  } else {
    res.redirect('/regions/v1/organisations/' + organisation.code)
  }

});

// Check a second lead user for an organisation
router.get('/regions/v1/organisations/:code/activate', (req, res) => {

  const organisationsAdded = req.session.data.organisationsAdded || []
  const organisation = organisationsAdded.find((org) => org.code === req.params.code)

  res.render('regions/v1/activate', {
    organisation
  });

});


// USER ADMIN

// Adding a user
router.post('/user-admin/v1/add', (req, res) => {

  req.session.data.users.push({
    id: Math.floor(Math.random() * 10000000).toString(),
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

// Editing a user’s role
router.get('/user-admin/v1/users/:id/change-role', (req, res) => {

  const id = req.params.id

  const user = req.session.data.users.find((user) => user.id === id )

  res.render('user-admin/v1/change-role', {
    user
  });

});

// Updating a user’s role
router.post('/user-admin/v1/users/:id/update', (req, res) => {

  const id = req.params.id

  const user = req.session.data.users.find((user) => user.id === id )

  user.role = req.body.role;

  // Reset session data
  req.session.data.role = ""

  res.redirect('/user-admin/v1');

});

// Adding a user - v2
router.post('/user-admin/v2/add', (req, res) => {

  console.log(req.session.data)

  req.session.data.users.push({
    id: Math.floor(Math.random() * 10000000),
    firstName: req.session.data.firstName,
    lastName: req.session.data.lastName,
    email: req.session.data.email,
    permissions: req.session.data.permissions,
    status: 'Invited'
  })

  // Reset data
  req.session.data.email = '';
  req.session.data.firstName = '';
  req.session.data.lastName = '';
  req.session.data.permissions = [];

  res.redirect('/user-admin/v2');

});


// Editing a user’s role
router.get('/user-admin/v2/users/:id/change-permissions', (req, res) => {

  const id = req.params.id

  const user = req.session.data.users.find((user) => user.id === id )

  res.render('user-admin/v2/change-permissions', {
    user
  });

});

// Updating a user’s role
router.post('/user-admin/v2/users/:id/update', (req, res) => {

  const id = req.params.id

  const user = req.session.data.users.find((user) => user.id === id )

  user.permissions = req.session.data.permissions;

  // Reset session data
  req.session.data.permissions = [];

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



// Updating user profile
router.post('/user-profile/v1/update', (req, res) => {

  let currentUser = req.session.data.users.find((user) => user.id === req.session.data.currentUserId);

  if (req.body.firstName) {
    currentUser.firstName = req.body.firstName;
  }

  if (req.body.lastName) {
    currentUser.lastName = req.body.lastName;
  }

  if (req.body.email) {
    currentUser.lastName = req.body.email;
  }

  if (req.body.professionalBody) {
    currentUser.professionalBody = req.body.professionalBody;
  }

  if (req.body.doctorNumber) {
    currentUser.professionalBodyNumber = req.body.doctorNumber;
  }

  if (req.body.nurseNumber) {
    currentUser.professionalBodyNumber = req.body.nurseNumber;
  }


  res.redirect('/user-profile/v1');

});


module.exports = router;
