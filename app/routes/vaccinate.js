module.exports = router => {

  router.post('/vaccinate/answer-patient-nhs-number-known', (req, res) => {

    const nhsNumberKnown = req.session.data.nhsNumberKnown;

    if (nhsNumberKnown === "yes") {
      res.redirect('/vaccinate/patient-history')
    } else if (nhsNumberKnown === "no") {
      res.redirect('/vaccinate/patient-search')
    } else {
      res.redirect('/vaccinate/patient?showError=yes')
    }

  })


  // Routing page after DONE
  router.post('/vaccinate/what-next', (req, res) => {

    const answer = req.session.data.nextStep;

    req.session.data.injectionSite = ""

    if (answer === 'same-vaccination-another-patient') {

      req.session.data.patientName = ""
      req.session.data.nhsNumber = ""

      res.redirect('/vaccinate/patient?repeatVaccination=yes&repeatPatient=no')

    } else if (answer === 'same-patient-another-vaccination') {

      req.session.data.vaccine = ""
      req.session.data.vaccineProduct = ""
      req.session.data.vaccineBatch = ""

      res.redirect('/vaccinate/vaccine?repeatPatient=yes&repeatVaccination=no')

    } else {

      res.redirect('/home')
    }

  })

}
