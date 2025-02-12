module.exports = router => {

 router.post('/find-a-record/answer-search', (req, res) => {
  const data = req.session.data

  if (data.nhsNumberKnown === "yes") {

    req.session.data.patientName = "Jodie Brown"
    req.session.data.dateOfBirth = {day: "15", month: "8", year: "1949"}
    req.session.data.postcode = "GD3 I83"

    return res.redirect('/find-a-record/patient-history')
  } else if (data.nhsNumberKnown === "no") {
    res.redirect('/find-a-record/patient-search')
  } else {
    res.redirect('/find-a-record')
  }

})

  router.get('/find-a-record/records/:id', (req, res) => {

    const id = req.params.id

    const vaccination = req.session.data.vaccinationsRecorded.find((record) => record.id === id)

    res.render('find-a-record/check', {
      vaccination
    })

  })

  router.post('/find-a-record/records/:id', (req, res) => {

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

    res.redirect(`/find-a-record/records/${id}?changedField=${data.changedField}`)

  })

  router.get('/find-a-record/records/:id/:page', (req, res) => {

    const id = req.params.id
    const page = req.params.page

    const vaccination = req.session.data.vaccinationsRecorded.find((record) => record.id === id)

    res.render(`find-a-record/${page}`, {
      vaccination
    })

  })

}
