module.exports = router => {

  router.get('/prototype-setup/setup-batches', (req, res) => {

    const data = req.session.data
    let vaccineStock = data.vaccineStock

    const dateNow = new Date()
    const millisecondsPerDay = 86400000

    const vaccines = data.vaccines
    const siteId = "RW3NM"

    for (vaccine of vaccines) {
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

}
