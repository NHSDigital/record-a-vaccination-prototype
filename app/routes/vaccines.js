module.exports = (router) => {


  // Adding a vaccine
  router.post('/vaccines/add', (req, res) => {

    const data = req.session.data

    req.session.data.vaccines.push({
      id: Math.floor(Math.random() * 10000000).toString(),
      vaccine: data.vaccine,
      vaccineProduct: data.vaccineProduct,
      siteCode: data.siteCode,
      batches: [
        {
          id: Math.floor(Math.random() * 10000000).toString(),
          batchNumber: data.batchNumber,
          expiryDate: "2024-11-20"
        }
      ]
    })

    // Reset data
    req.session.data.vaccine = ''
    req.session.data.vaccineProduct = ''
    req.session.data.siteCode = ''
    req.session.data.batchNumber = ''
    req.session.data['batchExpiryDate-day'] = ''
    req.session.data['batchExpiryDate-month'] = ''
    req.session.data['batchExpiryDate-year'] = ''

    res.redirect('/vaccines')
  })

}
