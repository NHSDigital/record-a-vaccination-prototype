module.exports = router => {

  router.post('/clinics/answer-patient-nhs-number-known', (req, res) => {
    const nhsNumberKnown = req.session.data.nhsNumberKnown

    if (nhsNumberKnown === 'yes') {
      return res.redirect('/clinics/patient-history')
    } else if (nhsNumberKnown === 'no') {
      return res.redirect('/clinics/patient-search')
    }

    return res.redirect('/clinics/patient')
  })

}
