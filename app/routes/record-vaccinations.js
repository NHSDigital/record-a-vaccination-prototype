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

  router.get('/record-vaccinations', (req, res) => {
    const data = req.session.data
    const vaccinesAddedCount = data.vaccineStock.length

    let vaccinationTodayError

    if (vaccinesAddedCount == 0) {
      return res.render('record-vaccinations/no-vaccines-added')
    }

    if (req.query.showErrors === 'yes') {
      if (!req.session.data.vaccinationToday) {
        vaccinationTodayError = 'Select if the vaccination is today'
      }
    }

    res.render('record-vaccinations/index', {
      vaccinationTodayError
    })
  })

  router.post('/record-vaccinations/answer-date', (req, res) => {
    const data = req.session.data

    if (!data.vaccinationToday) {
      return res.redirect('/record-vaccinations/?showErrors=yes')
    }
    res.redirect('/record-vaccinations/delivery-team')
  })

  router.get('/record-vaccinations/delivery-team', (req, res) => {
    let errors = []
    const data = req.session.data
    const currentOrganisation = res.locals.currentOrganisation

    const vaccineStock = data.vaccineStock
    const siteIdsWithVaccines = [...new Set(vaccineStock.map((vaccineAdded) => vaccineAdded.siteId))]

    const sitesInUse = currentOrganisation.sites.filter((site) => siteIdsWithVaccines.includes(site.id))


    if (req.query.showErrors === "yes") {
      if (!req.session.data.deliveryTeam) {
        errors.push({
          text: "Select a site",
          href: "#delivery-team-1"
        })
      }
    }

    res.render('record-vaccinations/delivery-team', {
      sitesInUse,
      errors
    })
  })

  router.post('/record-vaccinations/answer-delivery-team', (req, res) => {
    const data = req.session.data

    if (!data.deliveryTeam) {
      return res.redirect('/record-vaccinations/delivery-team?showErrors=yes')
    } else {
      res.redirect('/record-vaccinations/vaccinator')
    }
  })

  router.get('/record-vaccinations/vaccinator', (req, res) => {
    const data = req.session.data
    let vaccinatorError

    let otherVaccinators = data.users
      .filter((user) => {

        const userOrgnisationSetting = (user.organisations || []).find((organisation) => organisation.id === data.currentOrganisationId)

        return (user.id != data.currentUserId) && userOrgnisationSetting && userOrgnisationSetting.vaccinator && (userOrgnisationSetting.status === "Active")
      })
      .sort((a, b) => {
        const nameA = a.firstName.toUpperCase(); // ignore upper and lowercase
        const nameB = b.firstName.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      })

    if (req.query.showErrors === 'yes') {
      if (!req.session.data.vaccinatorId) {
        vaccinatorError = 'Select the vaccinator'
      }
    }

    res.render('record-vaccinations/vaccinator', {
      vaccinatorError,
      otherVaccinators
    })
  })

  router.post('/record-vaccinations/answer-vaccinator', (req, res) => {
    const data = req.session.data

    if (!data.vaccinatorId) {
      return res.redirect('/record-vaccinations/vaccinator?showErrors=yes')
    }
    res.redirect('/record-vaccinations/vaccine')
  })

  router.get('/record-vaccinations/vaccine', (req, res) => {
    let vaccineError, vaccineProductError
    const data = req.session.data

    const vaccineStock = data.vaccineStock.filter((vaccine) => vaccine.siteId === data.deliveryTeam)
    const vaccinesAdded = [...new Set(vaccineStock.map((vaccineAdded) => vaccineAdded.vaccine))]
    const vaccineProductsAdded = [...new Set(vaccineStock.map((vaccineAdded) => vaccineAdded.vaccineProduct))]

    let vaccinesAvailable = JSON.parse(JSON.stringify(data.vaccines)).filter((vaccine) => vaccinesAdded.includes(vaccine.name))

    // Filter all vaccine products to only show ones with batches added
    for (vaccineAvailable of vaccinesAvailable) {
      vaccineAvailable.products = vaccineAvailable.products.filter((vaccineProduct) => vaccineProductsAdded.includes(vaccineProduct.name))
    }

    if (req.query.showErrors === 'yes') {
      if (!data.vaccine) {
        vaccineError = 'Select the vaccine'
      }

      if (data.vaccine && !req.session.data.vaccineProduct) {
        vaccineProductError = 'Select the vaccine product'
      }
    }

    res.render('record-vaccinations/vaccine', {
      vaccineError,
      vaccineProductError,
      vaccinesAvailable
    })
  })

  router.post('/record-vaccinations/answer-vaccine', (req, res) => {
    const data = req.session.data

    if (!data.vaccine || !data.vaccineProduct) {
      return res.redirect('/record-vaccinations/vaccine?showErrors=yes')
    }
    res.redirect('/record-vaccinations/batch')
  })


  router.post('/record-vaccinations/answer-patient-nhs-number-known', (req, res) => {

    const nhsNumberKnown = req.session.data.nhsNumberKnown;
    req.session.data.nhsNumber = req.session.data.nhsNumber.trim()
    const nhsNumber = req.session.data.nhsNumber.replaceAll(' ', '')

    if (nhsNumberKnown === "yes" && nhsNumber.match(/^\d{10}$/) &&  nhsNumber.startsWith('9')) {

      req.session.data.patientName = "Jodie Brown"
      req.session.data.dateOfBirth = {day: "15", month: "8", year: "1949"}
      req.session.data.postcode = "GD3 I83"

      res.redirect('/record-vaccinations/patient-history')
    } else if (nhsNumberKnown === "no") {
      res.redirect('/record-vaccinations/patient-search')
    } else {
      res.redirect('/record-vaccinations/patient?showError=yes')
    }
  })

  router.get('/record-vaccinations/patient', (req, res) => {

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
            text: "Enter an NHS number",
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


    res.render('record-vaccinations/patient', {
      nhsNumberKnownError,
      nhsNumberError,
      errorList
    })
  })


 router.post('/record-vaccinations/patient-search', (req, res) => {
    const data = req.session.data
    const firstName = req.session.data.firstName;
    const lastName = req.session.data.lastName;
    const dateOfBirth = req.session.data.dateOfBirth;
    const postcode = req.session.data.postcode;
    let errors = []
    let firstNameError, lastNameError, dateOfBirthError, postcodeError

    if (firstName === "") {
      firstNameError = "Enter a first name"
      errors.push({
        text: firstNameError,
        href: "#firstName"
      })
    }

    if (lastName === "") {
      lastNameError = "Enter a last name"
      errors.push({
        text: lastNameError,
        href: "#lastName"
      })
    }

    if (dateOfBirth.day === "" || dateOfBirth.month  === "" || dateOfBirth.year === "") {
      dateOfBirthError = "Enter a date of birth"
      errors.push({
        text: dateOfBirthError,
        href: "#dateOfBirth"
      })
    }

    if (errors.length === 0) {

      // If day of month is odd, pretend there’s no search result
      if (Number(dateOfBirth.day) % 2) {
        res.redirect('/record-vaccinations/no-search-result')

      // If postcode blank, pretend there’s multiple results
      } else if (postcode === "") {
        res.redirect('/record-vaccinations/refine-search-result')

      // Otherwise pretend there is a single result and
      // go to patient details page
      } else {
        data.patientName = 'Jodie Brown'
        data.nhsNumber = '9123456788'
        res.redirect('/record-vaccinations/patient-history')
      }
    } else {
      res.render('record-vaccinations/patient-search', {
        errors,
        firstNameError,
        lastNameError,
        dateOfBirthError,
        postcodeError
      })
    }
  })


 router.get('/record-vaccinations/create-a-record', (req, res) => {

  const firstName = req.session.data.firstName;
  const lastName = req.session.data.lastName;
  const dateOfBirth = req.session.data.dateOfBirth;
  const postcode = req.session.data.postcode;
  const gender = req.session.data.gender;
  let errors = []
  let firstNameError, lastNameError, dateOfBirthError, postcodeError, genderError

  if (req.query.showErrors == 'yes') {
    if (firstName === "") {
      firstNameError = "Enter a first name"
      errors.push({
        text: firstNameError,
        href: "#firstName"
      })
    }

    if (lastName === "") {
      lastNameError = "Enter a last name"
      errors.push({
        text: lastNameError,
        href: "#lastName"
      })
    }

    if (dateOfBirth.day === "" || dateOfBirth.month  === "" || dateOfBirth.year === "") {
      dateOfBirthError = "Enter a date of birth"
      errors.push({
        text: dateOfBirthError,
        href: "#dateOfBirth"
      })
    }

    if (postcode === "") {
      postcodeError = "Enter a postcode"
      errors.push({
        text: postcodeError,
        href: "#postcode"
      })
    }

    if (!gender) {
      genderError = "Select an option"
      errors.push({
        text: genderError,
        href: "#gender"
      })
    }
  }

  res.render('record-vaccinations/create-a-record', {
    errors,
    firstNameError,
    lastNameError,
    dateOfBirthError,
    postcodeError,
    genderError
  })
})


  router.post('/record-vaccinations/create-a-record', (req, res) => {
    const data = req.session.data
    const firstName = req.session.data.firstName;
    const lastName = req.session.data.lastName;
    const dateOfBirth = req.session.data.dateOfBirth;
    const postcode = req.session.data.postcode;
    const gender = req.session.data.gender;

    if (firstName != '' && lastName != '' && dateOfBirth.day != '' && dateOfBirth.month != '' && dateOfBirth.year != '' && postcode != '' && gender != '') {

      res.redirect('/record-vaccinations/consent')
    } else {
      res.redirect('/record-vaccinations/create-a-record?showErrors=yes')
    }

  })


  router.get('/record-vaccinations/patient-estimated-due-date', (req, res) => {

    const showError = req.query.showError
    const data = req.session.data
    const pregnancyDueDate = dateFromYearMonthDay(data.pregnancyDueDate?.year, data.pregnancyDueDate?.month, data.pregnancyDueDate?.day);

    let dateErrorMessage = false

    if (showError === 'yes') {

      if (!pregnancyDueDate) {
        dateErrorMessage = "Enter an estimated due date"
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

    res.render('record-vaccinations/patient-estimated-due-date', {
      dateErrorMessage
    })
  })


  // Routing page after setting pregnancy estimated due date
  router.post('/record-vaccinations/save-estimated-due-date', (req, res) => {

    const data = req.session.data
    const pregnancyDueDate = dateFromYearMonthDay(data.pregnancyDueDate?.year, data.pregnancyDueDate?.month, data.pregnancyDueDate?.day)

    // Re-render with error if date is not set
    if (!pregnancyDueDate) {
      return res.redirect('/record-vaccinations/patient-estimated-due-date?showError=yes')
    }

    // Skip to consent page if the vaccination happened in the past
    // as it’s then too late for any warnings
    if (data.vaccinationToday != "yes") {
      return res.redirect('/record-vaccinations/consent')
    }

    // Vaccination date is today
    const vaccinationDate = new Date()

    // Estimated due date is based on 40 weeks (280 days) since last period
    const numberOfDaysPregnant = 280 - daysBetweenDates(vaccinationDate, pregnancyDueDate)

    // Being less than 3 weeks or more than 44 weeks (308 days) pregnant
    // results in an error
    if (numberOfDaysPregnant < 21 || numberOfDaysPregnant > 308) {
      return res.redirect('/record-vaccinations/patient-estimated-due-date?showError=yes')
    }

    // RSV is recommended from 28+ weeks (196 days)
    if (data.vaccinationToday == 'yes' && data.vaccine === "RSV" && numberOfDaysPregnant < 196) {
      res.redirect('/record-vaccinations/patient-estimated-due-date-rsv-warning')

    // Pertussis is recommended between 16 weeks (112 days) and 32 weeks
    } else if (data.vaccinationToday == 'yes' && data.vaccine === "pertussis" && numberOfDaysPregnant < 112) {
      res.redirect('/record-vaccinations/patient-estimated-due-date-pertussis-warning')
    } else {
      res.redirect('/record-vaccinations/consent')
    }

  });

  router.get('/record-vaccinations/patient-estimated-due-date-rsv-warning', (req, res) => {

    const data = req.session.data
    const pregnancyDueDate = dateFromYearMonthDay(data.pregnancyDueDate?.year, data.pregnancyDueDate?.month, data.pregnancyDueDate?.day)

    // Vaccination date is today
    const vaccinationDate = new Date()

    // Estimated due date is based on 40 weeks (280 days) since last period
    const numberOfDaysPregnant = 280 - daysBetweenDates(vaccinationDate, pregnancyDueDate)

    const fullWeeksPregnant = Math.floor(numberOfDaysPregnant / 7)
    const remainderDaysPregnant = (numberOfDaysPregnant % 7)

    res.render('record-vaccinations/patient-estimated-due-date-rsv-warning', {
      fullWeeksPregnant,
      remainderDaysPregnant
    })

  })

  router.get('/record-vaccinations/patient-estimated-due-date-pertussis-warning', (req, res) => {

    const data = req.session.data
    const pregnancyDueDate = dateFromYearMonthDay(data.pregnancyDueDate?.year, data.pregnancyDueDate?.month, data.pregnancyDueDate?.day)

    // Vaccination date is today
    const vaccinationDate = new Date()

    // Estimated due date is based on 40 weeks (280 days) since last period
    const numberOfDaysPregnant = 280 - daysBetweenDates(vaccinationDate, pregnancyDueDate)

    const fullWeeksPregnant = Math.floor(numberOfDaysPregnant / 7)
    const remainderDaysPregnant = (numberOfDaysPregnant % 7)

    res.render('record-vaccinations/patient-estimated-due-date-pertussis-warning', {
      fullWeeksPregnant,
      remainderDaysPregnant
    })

  })


  router.get('/record-vaccinations/eligibility', (req, res) => {
    const data = req.session.data
    const eligibility = data.eligibility
    let errors = []

    if (req.query.showErrors === "yes") {
      if (!eligibility || eligibility === "" || eligibility == []) {
        errors.push({
          text: "Select why you are giving them the vaccine",
          href: "#eligibility-1"
        })
      }
    }

    res.render('record-vaccinations/eligibility', {
      errors
    })
  })

  router.post('/record-vaccinations/answer-eligibility', (req, res) => {
    const data = req.session.data
    const eligibility = data.eligibility

    let nextPage;

    if (!eligibility || eligibility === "" || eligibility == []) {

      nextPage = "/record-vaccinations/eligibility?showErrors=yes"

    } else if (data.patientName && data.patientName != "" && data.repeatPatient === "yes") {

      if (data.vaccine === "Pertussis" || ((data.vaccine == "RSV") && (eligibility === "Pregnant"))) {
        nextPage = "/record-vaccinations/patient-estimated-due-date"
      } else {
        nextPage = "/record-vaccinations/patient-history"
      }

    } else if (data.vaccine == "flu") {
      if (data.eligibility === "Healthcare worker") {
        nextPage = "/record-vaccinations/healthcare-worker"
      } else {
        nextPage = "/record-vaccinations/patient"
      }
    } else if (data.vaccine == "COVID-19") {
      nextPage = "/record-vaccinations/location"
    } else {
      nextPage = "/record-vaccinations/patient"
    }

    res.redirect(nextPage)
  })



  router.get('/record-vaccinations/done', (req, res) => {
    const data = req.session.data
    let errors = []
    let error

    if (req.query.showErrors === 'yes') {
      if (!data.nextStep) {
        error = {
          text: "Select the next vaccination",
          href: "#next-step-1"
        }
        errors.push(error)
      }
    }

    res.render('record-vaccinations/done', {
      errors,
      error
    })
  })

  router.get('/record-vaccinations/healthcare-worker', (req, res) => {

    let healthcareWorkerRoleError
    let errors = []
    const data = req.session.data
    const healthcareWorker = data.healthcareWorker

    if (req.query.showErrors === 'yes') {
      if (!healthcareWorker || healthcareWorker === '') {
        healthcareWorkerRoleError = {
          text: "Select a role",
          href: "#healthcare-worker-1"
        }
        errors.push(healthcareWorkerRoleError)
      }
    }

    res.render('record-vaccinations/healthcare-worker', {
      errors,
      healthcareWorkerRoleError
    })
  })

  // Routing for after healthcare worker question
  router.post('/record-vaccinations/answer-healthcare-worker', (req, res) => {
    const data = req.session.data
    const healthcareWorker = data.healthcareWorker
    let nextPage

    console.log(healthcareWorker)

    if (healthcareWorker && healthcareWorker != '') {
      nextPage = '/record-vaccinations/location'
    } else {
      nextPage = '/record-vaccinations/healthcare-worker?showErrors=yes'
    }

    res.redirect(nextPage)

  })

  // Routing page after DONE
  router.post('/record-vaccinations/what-next', (req, res) => {

    const data = req.session.data
    const answer = data.nextStep

    if (answer) {
      // Reset these value regardless of next step
      data.injectionSite = ""
      data.otherInjectionSite = ""
      data.consent = ""
      data.consentClinicianName = ""
      data.consentAttorneyName = ""
      data.consentParentName = ""
      data.consentAdvocateName = ""
      data.consentDeputyName = ""
      data.healthcareWorker = ""
    }

    if (answer === 'same-vaccination-another-patient') {

      req.session.data.patientName = ""
      req.session.data.nhsNumber = ""

      // newly added batch becomes the default
      if (data.vaccineBatch == 'add-new') {
        data.vaccineBatch = data.newBatchNumber
        data.vaccineExpiryDate = data.newBatchExpiryDate
        data.newBatchNumber = ""
      }

      res.redirect('/record-vaccinations/review-previous')

    } else if (answer === 'same-patient-another-vaccination') {

      req.session.data.vaccine = ""
      req.session.data.vaccineProduct = ""
      req.session.data.vaccineBatch = ""
      req.session.data.eligibility = ""

      res.redirect('/record-vaccinations/vaccine?repeatPatient=yes&repeatVaccination=no')

    } else if (answer === 'different-vaccination-another-patient') {

      req.session.data.vaccine = ""
      req.session.data.vaccineProduct = ""
      req.session.data.vaccineBatch = ""
      req.session.data.eligibility = ""

      res.redirect('/record-vaccinations/vaccine')
    } else {
      res.redirect('/record-vaccinations/done?showErrors=yes')
    }

  })

  router.get('/record-vaccinations/batch', (req, res) => {
    let error
    const data = req.session.data
    const currentOrganisation = res.locals.currentOrganisation

    const vaccine = data.vaccineStock.find(function(batch) {
      return (batch.vaccineProduct === data.vaccineProduct) &&
        (batch.vaccine === data.vaccine)
    }) || {}

    const batches = vaccine.batches

    if (req.query.showError === 'yes') {

      if (!data.batchNumber) {
        error = {
          text: "Select a batch or add a batch",
          href: "#batch-number-1"
        }
      }
    }

    res.render('record-vaccinations/batch', {
      batches,
      error
    })
  })

  router.get('/record-vaccinations/location', (req, res) => {
    let errors = []
    let locationType = req.session.data.locationType

    if (req.query.showErrors === "yes") {
      if (!locationType) {
        errors.push({
          text: "Select where the vaccination is taking place",
          href: "#location-type-1"
        })
      }
    }

    res.render('record-vaccinations/location', {
      errors
    })
  })

  router.post('/record-vaccinations/answer-location', (req, res) => {

    const data = req.session.data
    let redirectPath

    if (!data.locationType) {
      redirectPath = "/record-vaccinations/location?showErrors=yes"
    } else {
      redirectPath = "/record-vaccinations/patient"
    }

    res.redirect(redirectPath)
  })

  router.post('/record-vaccinations/answer-batch', (req, res) => {

    const data = req.session.data
    const vaccineBatch = data.vaccineBatch
    const vaccine = data.vaccine

    let redirectPath

    if (vaccineBatch === "add-new") {
      redirectPath = "/record-vaccinations/add-batch"
    } else if (!vaccineBatch) {
      redirectPath = "/record-vaccinations/batch?showError=yes"
    } else if (["COVID-19", "flu", "RSV", "pneumococcal"].includes(data.vaccine)) {
      redirectPath = "/record-vaccinations/eligibility"
    } else if (data.repeatPatient === "yes") {
      redirectPath = "/record-vaccinations/patient-estimated-due-date"
    } else {
      redirectPath = "/record-vaccinations/patient"
    }
    res.redirect(redirectPath)
  })

  router.get('/record-vaccinations/add-batch', (req, res) => {
    const data = req.session.data
    let errors = []
    let batchNumberError, expiryDateError

    if (req.query.showErrors === 'yes') {

      if (data.newBatchNumber === '') {
        batchNumberError = {
          text: "Enter the batch number",
          href: "#batch-number"
        }
        errors.push(batchNumberError)
      }
      if (data.newBatchExpiryDate?.day === '' || data.newBatchExpiryDate?.month === '' || data.newBatchExpiryDate?.year === '') {
        expiryDateError = {
          text: "Enter the expiry date",
          href: "#batch-expiry-date-day"
        }
        errors.push(expiryDateError)
      }
    }

    res.render('record-vaccinations/add-batch', {
      errors,
      batchNumberError,
      expiryDateError
    })
  })

  router.get('/record-vaccinations/answer-add-batch', (req, res) => {
    const data = req.session.data
    let nextPage

    if (data.newBatchNumber === '' || data.newBatchExpiryDate?.day === '' || data.newBatchExpiryDate?.month === '' || data.newBatchExpiryDate?.year === '') {
      nextPage = "/record-vaccinations/add-batch?showErrors=yes"
    } else if ((data.vaccine === "pertussis") || (data.vaccine === "MMR")) {
      nextPage = "/record-vaccinations/patient"
    } else {
      nextPage = "/record-vaccinations/eligibility"
    }

    res.redirect(nextPage)
  })

  router.get('/record-vaccinations/consent', (req, res) => {
    let errors = []
    let consentError, consentClinicianError, consentAttorneyError, consentParentError, consentAdvocateError, consentDeputyError, consentAttorneyRelationshipError, consentDeputyRelationshipError
    const data = req.session.data
    const consent = data.consent
    const consentClinicianName = data.consentClinicianName
    const consentAttorneyName = data.consentAttorneyName
    const consentParentName = data.consentParentName
    const consentAdvocateName = data.consentAdvocateName
    const consentDeputyName = data.consentDeputyName
    const consentDeputyRelationship = data.consentDeputyRelationship
    const consentAttorneyRelationship = data.consentAttorneyRelationship

    if (req.query.showErrors === 'yes') {
      if (!consent) {
        consentError = {
          text: "Select who is giving consent",
          href: "#consent-1"
        }
        errors.push(consentError)
      } else if (consent === "Clinician acting in the patient’s best interests" && consentClinicianName === '') {

        consentClinicianError = {
          text: "Enter a name",
          href: "#consent-clinician-name"
        }
        errors.push(consentClinicianError)
      } else if (consent === "Person with lasting power of attorney for health and welfare") {

        if (consentAttorneyName === '') {
          consentAttorneyError = {
            text: "Enter a name",
            href: "#consent-attorney-name"
          }
          errors.push(consentAttorneyError)
        }

        if (consentAttorneyRelationship === '') {
          consentAttorneyRelationshipError = {
            text: "Enter the relationship to the patient",
            href: "#consent-attorney-relationship"
          }
          errors.push(consentAttorneyRelationshipError)
        }

      } else if (consent === "Parent or guardian" && consentParentName === '') {

        consentParentError = {
          text: "Enter a name",
          href: "#consent-parent-name"
        }
        errors.push(consentParentError)
      } else if (consent === "Mental capacity advocate" && consentAdvocateName === '') {

        consentAdvocateError = {
          text: "Enter a name",
          href: "#consent-advocate-name"
        }
        errors.push(consentAdvocateError)
      } else if (consent === "Court appointed deputy") {

        if (consentDeputyName === '') {
          consentDeputyError = {
            text: "Enter a name",
            href: "#consent-deputy-name"
          }
          errors.push(consentDeputyError)
        }

        if (consentDeputyRelationship === '') {
          consentDeputyRelationshipError = {
            text: "Enter the relationship to the patient",
            href: "#consent-deputy-relationship"
          }
          errors.push(consentDeputyRelationshipError)
        }

      }
    }

    res.render('record-vaccinations/consent', {
      errors, consentError, consentClinicianError, consentAttorneyError, consentParentError, consentAdvocateError, consentDeputyError, consentAttorneyRelationshipError, consentDeputyRelationshipError
    })
  })

  router.post('/record-vaccinations/answer-consent', (req, res) => {
    const data = req.session.data
    const consent = data.consent
    const consentClinicianName = data.consentClinicianName
    const consentAttorneyName = data.consentAttorneyName
    const consentParentName = data.consentParentName
    const consentAdvocateName = data.consentAdvocateName
    const consentDeputyName = data.consentDeputyName
    const consentDeputyRelationship = data.consentDeputyRelationship
    const consentAttorneyRelationship = data.consentAttorneyRelationship

    if (
      (consent === "patient") ||
      (consent === "Clinician acting in the patient’s best interests" && consentClinicianName != '') ||
      (consent === "Person with lasting power of attorney for health and welfare" && consentAttorneyName != '' && consentAttorneyRelationship != '') ||
      (consent === "Parent or guardian" && consentParentName != '') ||
      (consent === "Independent mental capacity advocate" && consentAdvocateName != '') ||
      (consent === "Court appointed deputy" && consentDeputyName != '' && consentDeputyRelationship != "")
    ) {
      res.redirect('/record-vaccinations/injection-site')
    } else {
      res.redirect('/record-vaccinations/consent?showErrors=yes')
    }

  })

  router.get('/record-vaccinations/injection-site', (req, res) => {
    const data = req.session.data
    const injectionSite = data.injectionSite
    const otherInjectionSite = data.otherInjectionSite

    let errors = []
    let injectionSiteError, otherInjectionSiteError

    if (req.query.showErrors === "yes") {

      if (!injectionSite) {
        injectionSiteError = {
          text: "Select where you gave the injection",
          href: "#injection-site-1"
        }
        errors.push(injectionSiteError)
      } else if (injectionSite === "other" && !otherInjectionSite) {
        otherInjectionSiteError = {
          text: "Select where you gave the injection",
          href: "#other-injection-site-1"
        }
        errors.push(otherInjectionSiteError)
      }

    }

    res.render('record-vaccinations/injection-site', {
      errors,
      injectionSiteError,
      otherInjectionSiteError
    })
  })

router.get('/record-vaccinations/check', (req, res) => {
    const data = req.session.data
    const vaccinator = data.users.find((user) => user.id === data.vaccinatorId)

    res.render('record-vaccinations/check', {
      vaccinator
    })
  })

  router.get('/record-vaccinations/review-previous', (req, res) => {
    const data = req.session.data
    const vaccinator = data.users.find((user) => user.id === data.vaccinatorId)

    res.render('record-vaccinations/review-previous', {
      vaccinator
    })
  })


  router.post('/record-vaccinations/answer-injection-site', (req, res) => {
    const data = req.session.data
    const injectionSite = data.injectionSite
    const otherInjectionSite = data.otherInjectionSite
    let redirectPath = "/record-vaccinations/check"

    if (!injectionSite || (injectionSite === "other" && !otherInjectionSite)) {
      redirectPath = "/record-vaccinations/injection-site?showErrors=yes"
    }

    res.redirect(redirectPath)
  })

}
