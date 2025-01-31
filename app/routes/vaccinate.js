// Returns a date object from a valid year, month, and day.
// Note: inputs can be strings, and month is based on 1 = Jan
// rather than 0 = Jan
// Time is set to midday
function dateFromYearMonthDay(year, month, day) {
  const yearInt = parseInt(year)
  const monthInt = parseInt(month)
  const dayInt = parseInt(day)

  if (yearInt > 0 && monthInt > 0 && dayInt > 0) {
    return new Date(yearInt, (monthInt - 1), dayInt, 12)
  } else {
    return null
  }
}

// If date2 is after date1 return positive number of days,
// if it’s before then negative, if it’s the same then 0.
function daysBetweenDates(date1, date2) {
  if (!date1 || !date2) {
    return null
  }
  const millisecondsInADay = (24 * 3600 * 1000)
  const differenceInMilliseconds = date2.getTime() - date1.getTime()
  const differenceInDays = differenceInMilliseconds / millisecondsInADay

  return Math.floor(differenceInDays)
}


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
    req.session.data.nhsNumber = req.session.data.nhsNumber.trim()
    const nhsNumber = req.session.data.nhsNumber.replaceAll(' ', '')

    if (nhsNumberKnown === "yes" && nhsNumber.match(/^\d{10}$/) &&  nhsNumber.startsWith('9')) {

      req.session.data.patientName = "Jodie Brown"
      req.session.data.dateOfBirth = {day: "15", month: "8", year: "1949"}
      req.session.data.postcode = "GD3 I83"

      res.redirect('/vaccinate/patient-history')
    } else if (nhsNumberKnown === "no") {
      res.redirect('/vaccinate/patient-search')
    } else {
      res.redirect('/vaccinate/patient?showError=yes')
    }
  })

  router.get('/vaccinate/patient', (req, res) => {

    const data = req.session.data
    const showError = data.showError
    const nhsNumberKnown = data.nhsNumberKnown
    const nhsNumber = String(data.nhsNumber).replaceAll(' ', '')

    let nhsNumberKnownError, nhsNumberError
    let errorList = []

    if (req.query.showError == 'yes') {

      if (!nhsNumberKnown) {
        nhsNumberKnownError = {
          text: "Select yes if you have the patient’s NHS number",
          href: "#nhs-number-known-1"
        }
        errorList.push(nhsNumberKnownError)
      }

      if (nhsNumberKnown === 'yes') {

        if (nhsNumber == '') {
          nhsNumberError = {
            text: "Enter NHS number",
            href: "#nhs-number"
          }
          errorList.push(nhsNumberError)
        } else if (nhsNumber.match(/[^\d]/)) {
          nhsNumberError = {
            text: "Enter a 10-digit number",
            href: "#nhs-number"
          }
          errorList.push(nhsNumberError)
        } else if (nhsNumber.length != 10) {
          nhsNumberError = {
            text: "Enter a 10-digit number",
            href: "#nhs-number"
          }
          errorList.push(nhsNumberError)
        } else if (!nhsNumber.startsWith('9')) {

          nhsNumberError = {
            text: "Enter a valid NHS number",
            href: "#nhs-number"
          }
          errorList.push(nhsNumberError)
        }

      }
    }


    res.render('vaccinate/patient', {
      nhsNumberKnownError,
      nhsNumberError,
      errorList
    })
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

  router.get('/vaccinate/patient-estimated-due-date', (req, res) => {

    const showError = req.query.showError
    const data = req.session.data
    const pregnancyDueDate = dateFromYearMonthDay(data.pregnancyDueDate?.year, data.pregnancyDueDate?.month, data.pregnancyDueDate?.day);

    let dateErrorMessage = false

    if (showError === 'yes') {

      if (!pregnancyDueDate) {
        dateErrorMessage = "Enter estimated due date"
      } else if (data.vaccinationToday === "yes") {

        const vaccinationDate = new Date()

        // Estimated due date is based on 40 weeks (280 days) since last period
        const numberOfDaysPregnant = 280 - daysBetweenDates(vaccinationDate, pregnancyDueDate)

        if (numberOfDaysPregnant < 21) {
          dateErrorMessage = "Estimated due date is too far in the future. Patient must be at least 21 days pregnant."
        } else if (numberOfDaysPregnant > 308) {
          dateErrorMessage = "Patient cannot be more than 44 weeks pregnant"
        }

      }
    }

    res.render('vaccinate/patient-estimated-due-date', {
      dateErrorMessage
    })
  })


  // Routing page after setting pregnancy estimated due date
  router.post('/vaccinate/save-estimated-due-date', (req, res) => {

    const data = req.session.data
    const pregnancyDueDate = dateFromYearMonthDay(data.pregnancyDueDate?.year, data.pregnancyDueDate?.month, data.pregnancyDueDate?.day)

    // Re-render with error if date is not set
    if (!pregnancyDueDate) {
      return res.redirect('/vaccinate/patient-estimated-due-date?showError=yes')
    }

    // Skip to consent page if the vaccination happened in the past
    // as it’s then too late for any warnings
    if (data.vaccinationToday != "yes") {
      return res.redirect('/vaccinate/consent')
    }

    // Vaccination date is today
    const vaccinationDate = new Date()

    // Estimated due date is based on 40 weeks (280 days) since last period
    const numberOfDaysPregnant = 280 - daysBetweenDates(vaccinationDate, pregnancyDueDate)

    // Being less than 3 weeks or more than 44 weeks (308 days) pregnant
    // results in an error
    if (numberOfDaysPregnant < 21 || numberOfDaysPregnant > 308) {
      return res.redirect('/vaccinate/patient-estimated-due-date?showError=yes')
    }

    // RSV is recommended from 28+ weeks (196 days)
    if (data.vaccinationToday == 'yes' && data.vaccine === "RSV" && numberOfDaysPregnant < 196) {
      res.redirect('/vaccinate/patient-estimated-due-date-rsv-warning')

    // Pertussis is recommended between 16 weeks (112 days) and 32 weeks
    } else if (data.vaccinationToday == 'yes' && data.vaccine === "Pertussis" && numberOfDaysPregnant < 112) {
      res.redirect('/vaccinate/patient-estimated-due-date-pertussis-warning')
    } else {
      res.redirect('/vaccinate/consent')
    }

  });

  router.get('/vaccinate/patient-estimated-due-date-rsv-warning', (req, res) => {

    const data = req.session.data
    const pregnancyDueDate = dateFromYearMonthDay(data.pregnancyDueDate?.year, data.pregnancyDueDate?.month, data.pregnancyDueDate?.day)

    // Vaccination date is today
    const vaccinationDate = new Date()

    // Estimated due date is based on 40 weeks (280 days) since last period
    const numberOfDaysPregnant = 280 - daysBetweenDates(vaccinationDate, pregnancyDueDate)

    const fullWeeksPregnant = Math.floor(numberOfDaysPregnant / 7)
    const remainderDaysPregnant = (numberOfDaysPregnant % 7)

    res.render('vaccinate/patient-estimated-due-date-rsv-warning', {
      fullWeeksPregnant,
      remainderDaysPregnant
    })

  })

  router.get('/vaccinate/patient-estimated-due-date-pertussis-warning', (req, res) => {

    const data = req.session.data
    const pregnancyDueDate = dateFromYearMonthDay(data.pregnancyDueDate?.year, data.pregnancyDueDate?.month, data.pregnancyDueDate?.day)

    // Vaccination date is today
    const vaccinationDate = new Date()

    // Estimated due date is based on 40 weeks (280 days) since last period
    const numberOfDaysPregnant = 280 - daysBetweenDates(vaccinationDate, pregnancyDueDate)

    const fullWeeksPregnant = Math.floor(numberOfDaysPregnant / 7)
    const remainderDaysPregnant = (numberOfDaysPregnant % 7)

    res.render('vaccinate/patient-estimated-due-date-pertussis-warning', {
      fullWeeksPregnant,
      remainderDaysPregnant
    })

  })

  router.post('/vaccinate/answer-eligibility', (req, res) => {
    const data = req.session.data

    let nextPage;

    if (data.patientName && data.patientName != "" && data.repeatPatient === "yes") {

      if (data.vaccine === "Pertussis" || ((data.vaccine == "RSV") && (data.eligibility === "Pregnant"))) {
        nextPage = "/vaccinate/patient-estimated-due-date"
      } else {
        nextPage = "/vaccinate/consent"
      }

    } else {

      if ((data.vaccine === "COVID-19") || (data.vaccine == "Flu")) {
        nextPage = "/vaccinate/location"
      } else {
        nextPage = "/vaccinate/patient"
      }
    }

    res.redirect(nextPage)
  })

  // Routing page after DONE
  router.post('/vaccinate/what-next', (req, res) => {

    const data = req.session.data
    const answer = data.nextStep

    // Reset these value regardless of next step
    data.injectionSite = ""
    data.otherInjectionSite = ""
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
      req.session.data.eligibility = ""

      res.redirect('/vaccinate/vaccine?repeatPatient=yes&repeatVaccination=no')

    } else {

      res.redirect('/home')
    }

  })

  router.get('/vaccinate/batch', (req, res) => {
    let error
    const data = req.session.data
    if (req.query.showError === 'yes') {

      if (!data.batchNumber) {
        error = {
          text: "Select a batch or add a batch",
          href: "#batch-number-1"
        }
      }
    }

    res.render('vaccinate/batch', {
      error
    })
  })

  router.post('/vaccinate/answer-batch', (req, res) => {

    const data = req.session.data
    const vaccineBatch = data.vaccineBatch
    const vaccine = data.vaccine

    let redirectPath

    if (vaccineBatch === "add-new") {
      redirectPath = "/vaccinate/add-batch"
    } else if (!vaccineBatch) {
      redirectPath = "/vaccinate/batch?showError=yes"
    } else if (["COVID-19", "Flu", "RSV"].includes(data.vaccine)) {
      redirectPath = "/vaccinate/eligibility"
    } else if (data.repeatPatient === "yes") {
      redirectPath = "/vaccinate/patient-estimated-due-date"
    } else {
      redirectPath = "/vaccinate/patient"
    }
    res.redirect(redirectPath)
  })


}
