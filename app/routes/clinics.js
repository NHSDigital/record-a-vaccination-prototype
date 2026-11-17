module.exports = router => {

  const findCareHome = (data) => data.allOrganisations.find((organisation) => organisation.id === data.careHomeId)

  router.get('/clinics/set-defaults', (req, res) => {
    const data = req.session.data

    res.render('clinics/set-defaults', {
      careHome: findCareHome(data)
    })
  })

  router.get('/clinics/session', (req, res) => {
    const data = req.session.data

    res.render('clinics/session', {
      careHome: findCareHome(data)
    })
  })

  router.get('/clinics/set-location', (req, res) => {
    const careHomes = req.session.data.allOrganisations.filter((organisation) => organisation.type === "Care home")

    res.render('clinics/set-location', {
      careHomes
    })
  })

  router.get('/clinics/cancel', (req, res) => {
    const patient = req.session.data.clinicPatients.find(
      patient => patient.nhsNumber === req.query.nhsNumber
    )

    if (!patient) {
      return res.status(404).send('Patient not found')
    }

    return res.render('clinics/cancel', {
      patientName: patient.name,
      nhsNumber: patient.nhsNumber
    })
  })

  router.get('/clinics/patient-history', (req, res, next) => {
    if (!req.query.nhsNumber) {
      return next()
    }

    const patient = req.session.data.clinicPatients.find(
      patient => patient.nhsNumber === req.query.nhsNumber
    )

    if (!patient) {
      return res.status(404).send('Patient not found')
    }

    return res.render('clinics/patient-history', { patientName: patient.name })
  })

  router.post('/clinics/cancel', (req, res) => {
    const patient = req.session.data.clinicPatients.find(
      patient => patient.nhsNumber === req.body.nhsNumber
    )

    if (!patient) {
      return res.status(404).send('Patient not found')
    }

    if (!req.body.cancelReason) {
      return res.status(400).send('Cancellation reason is required')
    }

    patient.cancellationReason = req.body.cancelReason

    return res.redirect('/clinics/session#cancelled')
  })

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
