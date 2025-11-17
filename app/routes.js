// External dependencies
const express = require('express');

const router = express.Router();

const authorise = function(req, res, next) {
  if (!req.session.data.currentUserId) {
    res.redirect('/auth/okta-sign-in')
  } else {
    next()
  }
}

// These routes require being logged in
router.use('/home{*splat}', authorise)
router.use('/record-vaccinations{*splat}', authorise)
router.use('/vaccines{*splat}', authorise)
router.use('/records{*splat}', authorise)
router.use('/reports{*splat}', authorise)
router.use('/user-admin{*splat}', authorise)
router.use('/user-profile{*splat}', authorise)

require('./routes/apply')(router)
require('./routes/record-vaccinations')(router)
require('./routes/regions')(router)
require('./routes/user-admin')(router)
require('./routes/user-onboarding')(router)
require('./routes/user-profile')(router)
require('./routes/vaccines')(router)
require('./routes/reports')(router)
require('./routes/records')(router)
require('./routes/prototype-admin')(router)
require('./routes/lists')(router)
require('./routes/support')(router)
require('./routes/auth')(router)
require('./routes/home')(router)
require('./routes/helpers')(router)

router.get('/product-page', (req, res) => {
  // Sign out the user - this is just to make it easier
  // to demo.
  if (req.session.data.currentUserId) {
    req.session.data.currentUserId = null

    // Needs a redirect as the data has already been cached
    res.redirect('/product-page')
    return
  }

  res.render('product-page')
})


module.exports = router;
