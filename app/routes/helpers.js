const { randomItem } = require('../lib/utils/random-item.js')

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

    const listOfFirstNames = ["Susana", "Steven", "Aleah", "Kaylen", "Stephan", "Donavon", "Emely", "Kailee", "Brooks", "Brenton", "Miles", "Emanuel", "Jedidiah", "Glenn", "Jude", "Ivory", "Austen", "Alyson", "Jaime", "Jordin", "Chad", "Janay", "Tahj", "Reginald", "Enoch", "Amiyah", "Benito", "April", "Joelle", "Brant"]

    const listOfLastNames = ["Ross", "Friedman", "Switzer", "Devore", "Dominguez", "Kohn", "Moreau", "Farrar", "Hogue", "Goldsmith", "Wilkins", "Cornwell", "Wimberly", "Messer", "Woods", "Forrest", "Aiello", "Kuykendall", "Trout", "Bigelow", "Moreland", "Lentz", "Hurst", "Quinonez", "Pak", "McNally", "Longo", "Hunt", "Villa", "Breaux"]

    const vaccinationsToAdd = parseInt(data.numberOfVaccinationsToAdd);

    const dateToday = new Date()

    const dayToday = (dateToday.getDate())
    // Months in JavaScript are zero-indexed
    const monthToday = (dateToday.getMonth() + 1)
    const yearToday = (dateToday.getFullYear())

    const organisationVaccines = res.locals.currentOrganisation.vaccines || []

    const vaccinesEnabled = organisationVaccines
      .filter((vaccine) => vaccine.status === "enabled")


    for (let i = 0; i < vaccinationsToAdd; i++) {

      const generatedId = Math.floor(Math.random() * 10000000).toString()
      const randomVaccine = randomItem(vaccinesEnabled)

      const vaccineProductsInStock = data.vaccineStock.filter((vaccineStockItem) => vaccineStockItem.vaccine == randomVaccine.name)

      const randomVaccineProduct = randomItem(vaccineProductsInStock)
      const randombatchNumber = randomItem(randomVaccineProduct.batches)

      const randomName = randomItem(listOfFirstNames) + " " + randomItem(listOfLastNames)

      const randomNhsNumber = "9" + (100000000 + Math.floor(Math.random() * 900000000)).toString()


      data.vaccinationsRecorded.push({
        id: generatedId,
        siteId: "RW3NM",
        date: {
          day: dayToday.toString(),
          month: monthToday.toString(),
          year: yearToday.toString()
        },
        vaccine: randomVaccine.name,
        vaccineProduct: randomVaccineProduct.vaccineProduct,
        patient: {
          name: randomName,
          nhsNumber: randomNhsNumber
        },
        batchNumber: randombatchNumber.batchNumber,
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

    res.redirect('/records')
  });

}
