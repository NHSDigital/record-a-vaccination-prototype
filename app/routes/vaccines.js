module.exports = (router) => {

  // Adding a vaccine
  router.post('/vaccines/add', (req, res) => {

    const data = req.session.data

    const generatedId = Math.floor(Math.random() * 10000000).toString()

    const expiryDate = new Date(data['batchExpiryDate-year'], (data['batchExpiryDate-month'] - 1), data['batchExpiryDate-day'], 12).toISOString().substring(0,10)

    req.session.data.vaccines.push({
      id: generatedId,
      vaccine: data.vaccine,
      vaccineProduct: data.vaccineProduct,
      siteCode: data.siteCode,
      batches: [
        {
          id: Math.floor(Math.random() * 10000000).toString(),
          batchNumber: data.batchNumber,
          expiryDate: expiryDate
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

    res.redirect('/vaccines/' + generatedId)
  })

  // Viewing select site page
  router.get('/vaccines/choose-site', (req, res) => {

    res.render('vaccines/choose-site')
  })

  // Viewing select vaccine page
  router.get('/vaccines/choose-vaccine', (req, res) => {

    res.render('vaccines/choose-vaccine')
  })

  // Viewing select vaccine page
  router.get('/vaccines/add-batch', (req, res) => {

    res.render('vaccines/add-batch')
  })

  // Viewing check answers page
  router.get('/vaccines/check', (req, res) => {

    res.render('vaccines/check')
  })


  // Adding a batch to an existing vaccine at a site
  router.post('/vaccines/:id/added', (req, res) => {
    const data = req.session.data
    const vaccine = data.vaccines.find((vaccine) => vaccine.id === req.params.id)
    if (!vaccine) { res.redirect('/vaccines'); return }

    const generatedId = Math.floor(Math.random() * 10000000).toString()

    const expiryDate = new Date(data['batchExpiryDate-year'], (data['batchExpiryDate-month'] - 1), data['batchExpiryDate-day'], 12).toISOString().substring(0,10)

    vaccine.batches.push({
      id: generatedId,
      batchNumber: data.batchNumber,
      expiryDate: expiryDate
    })

    // Reset data
    req.session.data.batchNumber = ''
    req.session.data['batchExpiryDate-day'] = ''
    req.session.data['batchExpiryDate-month'] = ''
    req.session.data['batchExpiryDate-year'] = ''

    res.redirect('/vaccines/' + vaccine.id)
  })

  // Viewing a vaccine product at a site
  router.get('/vaccines/:id', (req, res) => {
    const data = req.session.data
    const vaccine = data.vaccines.find((vaccine) => vaccine.id === req.params.id)
    if (!vaccine) { res.redirect('/vaccines'); return }
    const site = data.sites[vaccine.siteCode]

    const today = new Date().toISOString().substring(0,10)

    res.render('vaccines/product-page', {
      vaccine,
      site,
      today
    })
  })

  // Adding a batch to a vaccine product at a site
  router.get('/vaccines/:id/add', (req, res) => {
    const data = req.session.data
    const vaccine = data.vaccines.find((vaccine) => vaccine.id === req.params.id)
    if (!vaccine) { res.redirect('/vaccines'); return }
    const site = data.sites[vaccine.siteCode]

    res.render('vaccines/add-batch-to-site', {
      vaccine,
      site,
    })
  })

  // Adding a batch check answers page
  router.get('/vaccines/:id/add-batch-check', (req, res) => {
    const data = req.session.data
    const vaccine = data.vaccines.find((vaccine) => vaccine.id === req.params.id)
    if (!vaccine) { res.redirect('/vaccines'); return }
    const site = data.sites[vaccine.siteCode]

    res.render('vaccines/add-batch-to-site-check', {
      vaccine,
      site,
    })
  })

  // Editing a batch
  router.get('/vaccines/:vaccineId/:batchNumber', (req, res) => {
    const data = req.session.data
    const vaccine = data.vaccines.find((vaccine) => vaccine.id === req.params.vaccineId)
    if (!vaccine) { res.redirect('/vaccines'); return }
    const site = data.sites[vaccine.siteCode]
    const batch = vaccine.batches.find((batch) => batch.batchNumber === req.params.batchNumber)
    if (!batch) { res.redirect(`/vaccines/${vaccine.id}`); return }

    const expiryDate = new Date(batch.expiryDate)
    const day = expiryDate.getDate()
    const month = (expiryDate.getMonth() + 1)
    const year = expiryDate.getFullYear()

    res.render('vaccines/edit-batch', {
      vaccine,
      site,
      batch,
      day,
      month,
      year
    })
  })

  // Updating a batch
  router.post('/vaccines/:vaccineId/:batchNumber/update', (req, res) => {

    const data = req.session.data
    const vaccine = data.vaccines.find((vaccine) => vaccine.id === req.params.vaccineId)
    if (!vaccine) { res.redirect('/vaccines'); return }
    const batch = vaccine.batches.find((batch) => batch.batchNumber === req.params.batchNumber)
    if (!batch) { res.redirect(`/vaccines/${vaccine.id}`); return }

    const expiryDate = new Date(data['batchExpiryDate-year'], (data['batchExpiryDate-month'] - 1), data['batchExpiryDate-day']).toISOString().substring(0,10)

    batch.batchNumber = data.batchNumber;
    batch.expiryDate = expiryDate;

    res.redirect('/vaccines/' + vaccine.id)
  })

  // View page to deplete a batch
  router.get('/vaccines/:vaccineId/:batchNumber/deplete', (req, res) => {
    const data = req.session.data
    const vaccine = data.vaccines.find((vaccine) => vaccine.id === req.params.vaccineId)
    if (!vaccine) { res.redirect('/vaccines'); return }
    const site = data.sites[vaccine.siteCode]
    const batch = vaccine.batches.find((batch) => batch.batchNumber === req.params.batchNumber)
    if (!batch) { res.redirect(`/vaccines/${vaccine.id}`); return }

    res.render('vaccines/deplete-batch', {
      vaccine,
      site,
      batch
    })
  })

  // Mark batch as depleted
  router.post('/vaccines/:vaccineId/:batchNumber/depleted', (req, res) => {
    const data = req.session.data
    const vaccine = data.vaccines.find((vaccine) => vaccine.id === req.params.vaccineId)
    if (!vaccine) { res.redirect('/vaccines'); return }
    const batch = vaccine.batches.find((batch) => batch.batchNumber === req.params.batchNumber)

    let depletedDate = new Date()
    depletedDate.setUTCDate(data['batchDepletedDate-day'])
    depletedDate.setUTCMonth(data['batchDepletedDate-month'] - 1)
    depletedDate.setUTCFullYear(data['batchDepletedDate-year'])

    batch.depletedDate = depletedDate.toISOString().substring(0,10)

    res.redirect('/vaccines/' + vaccine.id)
  })
}
