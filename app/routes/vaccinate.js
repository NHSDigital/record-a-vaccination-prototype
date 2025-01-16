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
