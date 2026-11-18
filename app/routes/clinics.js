module.exports = router => {

  const findCareHome = (data, careHomeId = data.careHomeId) => data.allOrganisations.find((organisation) => organisation.id === careHomeId)

  router.get('/clinics', (req, res) => {
    const data = req.session.data
    const clinics = data.clinics.map((clinic) => ({
      ...clinic,
      careHome: clinic.location === "Care home" ? findCareHome(data, clinic.careHomeId) : undefined
    }))

    res.render('clinics/index', { clinics })
  })

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

  router.get('/clinics/session/:clinicId', (req, res) => {
    const data = req.session.data
    const clinic = data.clinics.find((item) => item.id === req.params.clinicId)

    if (!clinic) {
      return res.status(404).send('Clinic not found')
    }

    const completed = clinic.status === 'Completed'
    const clinicPatients = data.clinicPatients.map((patient) => ({
      ...patient,
      completed: completed || patient.completed
    }))
    const clinicDate = new Date(clinic.date)

    return res.render('clinics/session', {
      data: {
        ...data,
        clinicName: clinic.name,
        clinicDate: {
          day: clinicDate.getDate(),
          month: clinicDate.getMonth() + 1,
          year: clinicDate.getFullYear()
        },
        clinicPatientCount: clinic.patientCount,
        clinicPatients,
        location: clinic.location,
        status: completed ? 'complete' : undefined
      },
      careHome: findCareHome(data, clinic.careHomeId)
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

    return res.render('clinics/patient-history', {
      patientName: patient.name,
      nhsNumber: patient.nhsNumber,
      dateOfBirth: patient.dateOfBirth,
      age: patient.age
    })
  })

  router.get('/clinics/consent', (req, res, next) => {
    if (!req.query.nhsNumber) {
      return next()
    }

    const patient = req.session.data.clinicPatients.find(
      patient => patient.nhsNumber === req.query.nhsNumber
    )

    if (!patient) {
      return res.status(404).send('Patient not found')
    }

    return res.render('clinics/consent', {
      patientName: patient.name,
      nhsNumber: patient.nhsNumber
    })
  })

  router.post('/clinics/consent', (req, res, next) => {
    const nhsNumber = req.query.nhsNumber || req.body.nhsNumber

    if (!nhsNumber) {
      return next()
    }

    const patient = req.session.data.clinicPatients.find(
      patient => patient.nhsNumber === nhsNumber
    )

    if (!patient) {
      return res.status(404).send('Patient not found')
    }

    return res.render('clinics/consent', {
      patientName: patient.name,
      nhsNumber: patient.nhsNumber
    })
  })

  router.get('/clinics/injection-site', (req, res, next) => {
    if (!req.query.nhsNumber) {
      return next()
    }

    const patient = req.session.data.clinicPatients.find(
      patient => patient.nhsNumber === req.query.nhsNumber
    )

    if (!patient) {
      return res.status(404).send('Patient not found')
    }

    return res.render('clinics/injection-site', {
      patientName: patient.name,
      nhsNumber: patient.nhsNumber
    })
  })

  router.get('/clinics/check', (req, res, next) => {
    if (!req.query.nhsNumber) {
      return next()
    }

    const patient = req.session.data.clinicPatients.find(
      patient => patient.nhsNumber === req.query.nhsNumber
    )

    if (!patient) {
      return res.status(404).send('Patient not found')
    }

    return res.render('clinics/check', {
      patientName: patient.name,
      nhsNumber: patient.nhsNumber,
      dateOfBirth: patient.dateOfBirth,
      age: patient.age,
      careHome: findCareHome(req.session.data)
    })
  })

  router.post('/clinics/confirmation', (req, res, next) => {
    if (!req.body.nhsNumber) {
      return next()
    }

    const patient = req.session.data.clinicPatients.find(
      patient => patient.nhsNumber === req.body.nhsNumber
    )

    if (!patient) {
      return res.status(404).send('Patient not found')
    }

    patient.completed = true

    return res.render('clinics/confirmation', {
      patientName: patient.name,
      nhsNumber: patient.nhsNumber
    })
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
