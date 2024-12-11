module.exports = router => {

  // Routing page after DONE
  router.post('/vaccinate/what-next', (req, res) => {

    const answer = req.session.data.nextStep;

    console.log(answer)

    if (answer === 'same-vaccination-another-patient') {

      res.redirect('/vaccinate/patient?repeatVaccination=yes&repeatPatient=no')

    } else if (answer === 'same-patient-another-vaccination') {

      req.session.data.vaccine = ""
      req.session.data.vaccineProduct = ""

      res.redirect('/vaccinate/vaccine?repeatPatient=yes&repeatVaccination=no')

    } else {

      res.redirect('/home')
    }

  })

}
