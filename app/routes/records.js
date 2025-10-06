module.exports = router => {

  router.get('/records', (req, res) => {

    const data = req.session.data

    const currentOrganisation = res.locals.currentOrganisation

    let vaccinationsRecorded = data.vaccinationsRecorded.filter((vaccination) => vaccination.organisationId === currentOrganisation.id)

    const totalVaccinationsRecorded = vaccinationsRecorded.length

    // Get a list of all the different vaccine names recorded so far
    const vaccinesRecorded = [...new Set(vaccinationsRecorded
      .map((record) => record.vaccine))]


    const nameOrNhsNumberSearch = data.nameOrNhsNumber

    if (nameOrNhsNumberSearch && nameOrNhsNumberSearch != "") {

      vaccinationsRecorded = vaccinationsRecorded.filter(function(record) {

        return (
          record.patient.name.toLowerCase().startsWith(nameOrNhsNumberSearch.toLowerCase()) ||
          (record.patient.nhsNumber === nameOrNhsNumberSearch)
        )

      })
    }



    if (totalVaccinationsRecorded === 0) {
      res.render('records/no-vaccinations-recorded')
    } else {
      res.render('records/index', {
        vaccinesRecorded,
        vaccinationsRecorded
      })
    }
  })

 router.post('/records/answer-search', (req, res) => {
  const data = req.session.data

  if (data.nhsNumberKnown === "yes") {

    req.session.data.patientName = "Jodie Brown"
    req.session.data.dateOfBirth = {day: "15", month: "8", year: "1949"}
    req.session.data.postcode = "GD3 I83"

    return res.redirect('/records/patient-history')
  } else if (data.nhsNumberKnown === "no") {
    res.redirect('/records/patient-search')
  } else {
    res.redirect('/records')
  }

})

  // Show patient history
  router.get('/records/patient-history', (req, res) => {
    const recordDeleted = req.query.recordDeleted
    const vaccinationsRecorded = req.session.data.vaccinationsRecorded

    res.render('records/patient-history', {
      vaccinationsRecorded,
      recordDeleted
    })
  })

  // Delete a vaccination record
  router.post('/records/records/:id/confirm-delete', (req, res) => {
    const id = req.params.id
    const vaccinationsRecorded = req.session.data.vaccinationsRecorded
    const vaccination = vaccinationsRecorded.find((record) => record.id === id)
    const vaccine = vaccination.vaccine

    // Find the 'index' number of the vaccination
    const index = vaccinationsRecorded.indexOf(vaccination)

    // Remove item from array using 'splice', which takes an index
    req.session.vaccinationsRecorded = vaccinationsRecorded.splice(index, 1)

    res.redirect('/records/patient-history?recordDeleted=' + vaccine)
  })


  router.get('/records/records/:id', (req, res) => {

    const id = req.params.id

    const vaccination = req.session.data.vaccinationsRecorded.find((record) => record.id === id)

    res.render('records/check', {
      vaccination
    })

  })

  router.post('/records/records/:id', (req, res) => {

    const id = req.params.id
    const vaccination = req.session.data.vaccinationsRecorded.find((record) => record.id === id)
    const data = req.session.data

    if (data.injectionSite) {
      vaccination.injectionSite = data.injectionSite
    }
    if (data.vaccine) {
      vaccination.vaccine = data.vaccine
      vaccination.vaccineProduct = data.vaccineProduct
    }
    if (data.deliveryTeam) {
      vaccination.deliveryTeam = data.deliveryTeam
    }
    if (data.vaccinator) {
      vaccination.vaccinator = data.vaccinator
    }
    if (data.eligibility) {
      vaccination.eligibility = data.eligibility
    }
    if (data.consent) {
      vaccination.consent = data.consent
    }
    if (data.batchNumber) {
      vaccination.batchNumber = data.batchNumber
    }

    if (data.notes) {
      vaccination.notes = data.notes
    }

    if (data.vaccinationDateChanged === "yes") {
      vaccination.date = data.vaccinationDate
      data.vaccinationDateChanged = "no"
    }

    res.redirect(`/records/records/${id}?changedField=${data.changedField}`)

  })

  router.post('/records/patient-search', (req, res) => {
    const data = req.session.data
    const firstName = data.firstName;
    const lastName = data.lastName;
    const dateOfBirth = data.dateOfBirth;
    const postcode = data.postcode;

    if (firstName && lastName && dateOfBirth) {

      data.patientName = firstName + " " + lastName
      data.nhsNumber = '9123456788'

      res.redirect('/records/patient-history')
    } else {
      res.redirect('/records/patient-search')
    }

  })


  router.get('/records/records/:id/:page', (req, res) => {

    const id = req.params.id
    const page = req.params.page

    const vaccination = req.session.data.vaccinationsRecorded.find((record) => record.id === id)

    res.render(`records/${page}`, {
      vaccination
    })

  })

}
