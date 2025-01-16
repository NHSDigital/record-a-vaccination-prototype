module.exports = router => {

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

    const data = req.session.data
    const answer = data.nextStep

    // Reset these value regardless of next step
    data.injectionSite = ""
    data.consent = ""
    data.consentName = ""

    if (answer === 'same-vaccination-another-patient') {

      req.session.data.patientName = ""
      req.session.data.nhsNumber = ""

      // newly added batch becomes the default
      if (data.vaccineBatch == 'add-new') {
        data.vaccineBatch = data.newBatchNumber
        data.vaccineExpiryDate = data.newBatchExpiryDate
        data.newBatchNumber = ""
      }

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

  router.post('/vaccinate/answer-batch', (req, res) => {

    const data = req.session.data
    const vaccineBatch = data.vaccineBatch
    const vaccine = data.vaccine

    let redirectPath

    if (vaccineBatch === "add-new") {
      redirectPath = "/vaccinate/add-batch"
    } else if (vaccine === "Pertussis") {
      redirectPath = "/vaccinate/patient"
    } else if (vaccine === "RSV") {
      redirectPath = "/vaccinate/eligibility"
    } else {
      redirectPath = "/vaccinate/location"
    }
    res.redirect(redirectPath)
  })


}
