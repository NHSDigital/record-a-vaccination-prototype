module.exports = router => {

  router.get('/prototype-setup/setup-batches', (req, res) => {
    const data = req.session.data
    const currentOrganisation = res.locals.currentOrganisation

    let vaccineStock = data.vaccineStock

    const organisationVaccines = currentOrganisation.vaccines

    const dateNow = new Date()
    const millisecondsPerDay = 86400000

    const vaccines = data.vaccines
    const siteId = "RW3NM"

    for (vaccine of vaccines) {

      const organisationVaccine = organisationVaccines.find((organisationVaccine) => organisationVaccine.name === vaccine.name)

      if (organisationVaccine) {
        organisationVaccine.status = "enabled"
      } else {
        organisationVaccines.push({
          name: vaccine.name,
          status: "enabled"
        })
      }

      for (vaccineProduct of vaccine.products) {

        const numberOfBatchesToAdd = 1 + Math.floor(Math.random() * 10)

        let batches = []

        const generatedVaccineId = Math.floor(Math.random() * 10000000).toString()

        for (let step = 0; step < numberOfBatchesToAdd; step++) {

          const generatedBatchId = Math.floor(Math.random() * 10000000).toString()
          const generatedBatchNumber = "AB" + Math.floor(Math.random() * 1000000).toString()

          const generatedExpiryDate = new Date(dateNow.getTime() + (Math.random() * 100 * millisecondsPerDay)).toISOString()

          batches.push({
            id: generatedBatchId,
            batchNumber: generatedBatchNumber,
            expiryDate: generatedExpiryDate
          })
        }

        vaccineStock.push({
          id: generatedVaccineId,
          vaccine: vaccine.name,
          vaccineProduct: vaccineProduct.name,
          siteId: siteId,
          batches: batches
        })
      }
    }

    res.redirect('/vaccines')
  });


  router.post('/prototype-setup/add-vaccinations', (req, res) => {
    const data = req.session.data
    const currentOrganisation = res.locals.currentOrganisation

    const vaccinationsToAdd = parseInt(data.numberOfVaccinationsToAdd);

    const dateToday = new Date()

    const dayToday = (dateToday.getDate())
    // Months in JavaScript are zero-indexed
    const monthToday = (dateToday.getMonth() + 1)
    const yearToday = (dateToday.getFullYear())


    for (let i = 0; i < vaccinationsToAdd; i++) {

      const generatedId = Math.floor(Math.random() * 10000000).toString()

      data.vaccinationsRecorded.push({
        id: generatedId,
        siteId: "RW3NM",
        date: {
          day: dayToday.toString(),
          month: monthToday.toString(),
          year: yearToday.toString()
        },
        vaccine: "RSV",
        vaccineProduct: "Abrysvo",
        patient: {
          name: "Jodie Brown",
          nhsNumber: "9123123123"
        },
        batchNumber: "74725GJ0",
        batchExpiryDate: "2025-01-05",
        vaccinator: "Anna Brown",
        eligibility: ["Pregnant"],
        pregnancyDueDate: {
          day: "04",
          month: "02",
          year: "2025"
        },
        consent: "Patient",
        injectionSite: "Left arm",
        notes: "The patient has been taking Warfarin for 1 month as prescribed by GP.",
        editable: true
      })
    }

    res.redirect('/home')
  });

}
