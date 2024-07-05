module.exports = (router) => {
  // Answering whether the user has a Care Identity account or not
  router.post('/user-onboarding/v1/cis2-answer', (req, res) => {
    const answer = req.body.existingCareIdentityAccount

    if (answer === 'yes') {
      res.redirect('/user-onboarding/v1/cis2-setup')
    } else if (answer === 'no') {
      res.redirect('/user-onboarding/v1/cis2-alternative')
    } else if (answer === 'not-sure') {
      res.redirect('/user-onboarding/v1/cis2-not-sure')
    } else {
      res.redirect('/user-onboarding/v1/setup')
    }
  })

  // Answering type of authentication method
  router.post('/user-onboarding/v1/cis2-method-answer', (req, res) => {
    const answer = req.body.cis2Method

    if (answer === 'smartcard') {
      res.redirect('/user-onboarding/v1/cis2-smartcard')
    } else if (answer === 'windowsHello') {
      res.redirect('/user-onboarding/v1/cis2-windows-hello')
    } else if (answer === 'securityKey') {
      res.redirect('/user-onboarding/v1/cis2-security-key')
    } else if (answer === 'ipadapp') {
      res.redirect('/user-onboarding/v1/cis2-ipad-app')
    } else {
      res.redirect('/user-onboarding/v1/cis2-auth-method')
    }
  })
}
