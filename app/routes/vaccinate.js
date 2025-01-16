module.exports = router => {

  router.get('/vaccinate', (req, res) => {
    let vaccinationTodayError

    if (req.query.showErrors === 'yes') {
      if (!req.session.data.vaccinationToday) {
        vaccinationTodayError = 'Select if vaccination was today'
      }
    }

    res.render('vaccinate/index', {
      vaccinationTodayError
    })
  })

  router.post('/vaccinate/answer-date', (req, res) => {
    const data = req.session.data

    if (!data.vaccinationToday) {
      return res.redirect('/vaccinate/?showErrors=yes')
    }
    res.redirect('/vaccinate/delivery-team')
  })

  router.get('/vaccinate/vaccinator', (req, res) => {
    let vaccinatorError

    if (req.query.showErrors === 'yes') {
      if (!req.session.data.vaccinator) {
        vaccinatorError = 'Select the vaccinator'
      }
    }

    res.render('vaccinate/vaccinator', {
      vaccinatorError
    })
  })

  router.post('/vaccinate/answer-vaccinator', (req, res) => {
    const data = req.session.data

    if (!data.vaccinator) {
      return res.redirect('/vaccinate/vaccinator?showErrors=yes')
    }
    res.redirect('/vaccinate/vaccine')
  })

  router.get('/vaccinate/vaccine', (req, res) => {
    let vaccineError, vaccineProductError
    const data = req.session.data

    if (req.query.showErrors === 'yes') {
      if (!data.vaccine) {
        vaccineError = 'Select the vaccine'
      }

      if (data.vaccine && !req.session.data.vaccineProduct) {
        vaccineProductError = 'Select the vaccine product'
      }
    }

    res.render('vaccinate/vaccine', {
      vaccineError,
      vaccineProductError
    })
  })

  router.post('/vaccinate/answer-vaccine', (req, res) => {
    const data = req.session.data

    if (!data.vaccine || !data.vaccineProduct) {
      return res.redirect('/vaccinate/vaccine?showErrors=yes')
    }
    res.redirect('/vaccinate/batch')
  })


  router.post('/vaccinate/answer-patient-nhs-number-known', (req, res) => {

    const nhsNumberKnown = req.session.data.nhsNumberKnown;

    if (nhsNumberKnown === "yes") {

      req.session.data.patientName = "Jodie Brown"
      req.session.data.dateOfBirth = {day: "4", month: "7", year: "1964"}
      req.session.data.postcode = "GD3 I83"

      res.redirect('/vaccinate/patient-history')
    } else if (nhsNumberKnown === "no") {
      res.redirect('/vaccinate/patient-search')
    } else {
      res.redirect('/vaccinate/patient?showError=yes')
    }

  })


 router.post('/vaccinate/patient-search', (req, res) => {

    const firstName = req.session.data.firstName;
    const lastName = req.session.data.lastName;
    const dateOfBirth = req.session.data.dateOfBirth;
    const postcode = req.session.data.postcode;
    let errors = []
    let firstNameError, lastNameError, dateOfBirthError, postcodeError

    if (firstName === "") {
      firstNameError = "Enter first name"
      errors.push({
        text: firstNameError,
        href: "#firstName"
      })
    }

    if (lastName === "") {
      lastNameError = "Enter last name"
      errors.push({
        text: lastNameError,
        href: "#lastName"
      })
    }

    if (dateOfBirth.day === "" || dateOfBirth.month  === "" || dateOfBirth.year === "") {
      dateOfBirthError = "Enter date of birth"
      errors.push({
        text: dateOfBirthError,
        href: "#dateOfBirth"
      })
    }

    if (postcode === "") {
      postcodeError = "Enter postcode"
      errors.push({
        text: postcodeError,
        href: "#postcode"
      })
    }

    if (errors.length === 0) {

      if (Number(dateOfBirth.day) %2) {
        res.redirect('/vaccinate/no-search-result')
      } else {
        res.redirect('/vaccinate/search-result')
      }
    } else {
      res.render('vaccinate/patient-search', {
        errors,
        firstNameError,
        lastNameError,
        dateOfBirthError,
        postcodeError
      })
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
