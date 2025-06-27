module.exports = (router) => {

  // Adding a vaccine
  router.post('/vaccines/add', (req, res) => {

    const data = req.session.data

    const generatedId = Math.floor(Math.random() * 10000000).toString()

    const expiryDate = new Date(data.batchExpiryDate.year, (parseInt(data.batchExpiryDate.month) - 1), data.batchExpiryDate.day, 12).toISOString().substring(0,10)

    data.vaccineStock.push({
      id: generatedId,
      vaccine: data.vaccine,
      vaccineProduct: data.vaccineProduct,
      siteId: data.siteId,
      batches: [
        {
          id: Math.floor(Math.random() * 10000000).toString(),
          batchNumber: data.batchNumber,
          expiryDate: expiryDate,
          packType: data.packType
        }
      ]
    })

    // Reset data
    req.session.data.vaccine = ''
    req.session.data.vaccineProduct = ''
    req.session.data.packType = ''
    req.session.data.siteId = ''
    req.session.data.batchNumber = ''
    req.session.data.batchExpiryDate.day = ''
    req.session.data.batchExpiryDate.month = ''
    req.session.data.batchExpiryDate.year = ''

    res.redirect('/vaccines/' + generatedId)
  })

  // Viewing select site page
  router.get('/vaccines/choose-site', (req, res) => {

    res.render('vaccines/choose-site')
  })

  // Viewing select vaccine page
  router.get('/vaccines/choose-vaccine', (req, res) => {
    const data = req.session.data

    const vaccinesEnabledNames = res.locals.currentOrganisation.vaccines
      .filter((vaccine) => vaccine.status === "enabled")
      .map((vaccine) => vaccine.name)

    const vaccinesEnabled = data.vaccines.filter((vaccine) => vaccinesEnabledNames.includes(vaccine.name))

    const vaccinesDisabledNames = res.locals.currentOrganisation.vaccines
    .filter((vaccine) => vaccine.status === "disabled")
    .map((vaccine) => vaccine.name)


    const vaccinesDisabled = data.vaccines.filter((vaccine) => vaccinesDisabledNames.includes(vaccine.name))

    res.render('vaccines/choose-vaccine', {
      vaccinesEnabled,
      vaccinesDisabled
    })
  })

  // Confirmation of a vaccine being requested
  router.post('/vaccines/request', (req, res) => {

    const data = req.session.data
    const currentOrganisation = res.locals.currentOrganisation

    const vaccineRequested = currentOrganisation.vaccines
    .find((vaccine) => vaccine.name === data.vaccineRequested)

    vaccineRequested.status = "requested"

    const region = data.regions.find((region) => region.id === currentOrganisation.region)

    const currentDate = new Date().toISOString()
    const generatedId = "AB" + Math.floor(Math.random() * 10000000).toString()

    region.inbox ||= []
    region.inbox.push({
      id: generatedId,
      fromOrganisationId: currentOrganisation.id,
      vaccineRequested: data.vaccineRequested,
      sentOn: currentDate
    })
    res.redirect('/vaccines/requested')
  })


  // Confirmation of a vaccine being requested
  router.get('/vaccines/requested', (req, res) => {

    res.render('vaccines/requested')
  })


  // Viewing select vaccine page
  router.get('/vaccines/add-batch', (req, res) => {

    res.render('vaccines/add-batch')
  })

  // Viewing check answers page
  router.get('/vaccines/check', (req, res) => {

    const data = req.session.data
    const siteId = data.siteId

    const currentOrganisationSites = res.locals.currentOrganisation.sites || []

    const site = currentOrganisationSites.find((site) => site.id === siteId)

    res.render('vaccines/check', {
      site
    })
  })


  // Adding a batch to an existing vaccine at a site
  router.post('/vaccines/:id/added', (req, res) => {
    const data = req.session.data
    const vaccine = data.vaccineStock.find((vaccine) => vaccine.id === req.params.id)
    if (!vaccine) { res.redirect('/vaccines'); return }

    const generatedId = Math.floor(Math.random() * 10000000).toString()

    const expiryDate = new Date(data.batchExpiryDate.year, (parseInt(data.batchExpiryDate.month) - 1), data.batchExpiryDate.day, 12).toISOString().substring(0,10)

    vaccine.batches.push({
      id: generatedId,
      batchNumber: data.batchNumber,
      expiryDate: expiryDate,
      packType: data.packType
    })

    // Reset data
    req.session.data.batchNumber = ''
    req.session.data.batchExpiryDate.day = ''
    req.session.data.batchExpiryDate.month = ''
    req.session.data.batchExpiryDate.year = ''

    res.redirect('/vaccines/' + vaccine.id)
  })

  // Viewing a vaccine product at a site
  router.get('/vaccines/:id', (req, res) => {
    const data = req.session.data
    const perPage = 20; // Max number of users to show per page
    const page = parseInt(req.query.page) || 1  ;  // Current page, default to 1

    const vaccine = data.vaccineStock.find((vaccine) => vaccine.id === req.params.id)
    if (!vaccine) { res.redirect('/vaccines'); return }

    const currentOrganisation = res.locals.currentOrganisation

    const site = currentOrganisation.sites.find((site) => site.id === vaccine.siteId)

    const today = new Date().toISOString().substring(0,10)

    const allBatches = vaccine.batches.sort((a, b) => {
        const expiryA = a.expiryDate
        const expiryB = b.expiryDate
        if (expiryA > expiryB) {
          return -1;
        }
        if (expiryA < expiryB) {
          return 1;
        }
        return 0;
      })

    const totalBatches = allBatches.length
    const indexStartFrom = (page - 1) * perPage
    const totalPages = Math.ceil(totalBatches / perPage)

    const batches = allBatches.slice(indexStartFrom, indexStartFrom + perPage)


    res.render('vaccines/product-page', {
      vaccine,
      batches,
      site,
      today,
      totalPages,
      totalBatches,
      page
    })
  })

  // Adding a batch to a vaccine product at a site
  router.get('/vaccines/:id/add', (req, res) => {
    const data = req.session.data
    const vaccine = data.vaccineStock.find((vaccine) => vaccine.id === req.params.id)
    if (!vaccine) { res.redirect('/vaccines'); return }

    const currentOrganisationSites = res.locals.currentOrganisation.sites || []

    const site = currentOrganisationSites.find((site) => site.id == vaccine.siteId)

    res.render('vaccines/add-batch-to-site', {
      vaccine,
      site,
    })
  })

  // Adding a batch check answers page
  router.get('/vaccines/:id/add-batch-check', (req, res) => {
    const data = req.session.data
    const vaccine = data.vaccineStock.find((vaccine) => vaccine.id === req.params.id)
    if (!vaccine) { res.redirect('/vaccines'); return }

    const currentOrganisationSites = res.locals.currentOrganisation.sites || []

    const site = currentOrganisationSites.find((site) => site.id == vaccine.siteId)

    res.render('vaccines/add-batch-to-site-check', {
      vaccine,
      site,
    })
  })

  // Editing a batch
  router.get('/vaccines/:vaccineId/:batchNumber', (req, res) => {
    const data = req.session.data
    const vaccine = data.vaccineStock.find((vaccine) => vaccine.id === req.params.vaccineId)
    if (!vaccine) { res.redirect('/vaccines'); return }

    const currentOrganisationSites = res.locals.currentOrganisation.sites || []
    const site = currentOrganisationSites.find((site) => site.id == vaccine.siteId)

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
    const vaccine = data.vaccineStock.find((vaccine) => vaccine.id === req.params.vaccineId)
    if (!vaccine) { res.redirect('/vaccines'); return }
    const batch = vaccine.batches.find((batch) => batch.batchNumber === req.params.batchNumber)
    if (!batch) { res.redirect(`/vaccines/${vaccine.id}`); return }

    const expiryDate = new Date(data.batchExpiryDate.year, (parseInt(data.batchExpiryDate.month) - 1), data.batchExpiryDate.day, 12).toISOString().substring(0,10)

    batch.batchNumber = data.batchNumber;
    batch.expiryDate = expiryDate;

    res.redirect('/vaccines/' + vaccine.id)
  })

  // View page to deplete a batch
  router.get('/vaccines/:vaccineId/:batchNumber/deplete', (req, res) => {
    const data = req.session.data
    const vaccine = data.vaccineStock.find((vaccine) => vaccine.id === req.params.vaccineId)
    if (!vaccine) { res.redirect('/vaccines'); return }

    const currentOrganisationSites = res.locals.currentOrganisation.sites || []
    const site = currentOrganisationSites.find((site) => site.id == vaccine.siteId)

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
    const vaccine = data.vaccineStock.find((vaccine) => vaccine.id === req.params.vaccineId)
    if (!vaccine) { res.redirect('/vaccines'); return }
    const batch = vaccine.batches.find((batch) => batch.batchNumber === req.params.batchNumber)

    let depletedDate = new Date()

    batch.depletedDate = depletedDate.toISOString().substring(0,10)

    res.redirect('/vaccines/' + vaccine.id)
  })


  // View page to reactivate a batch
  router.get('/vaccines/:vaccineId/:batchNumber/reactivate', (req, res) => {
    const data = req.session.data
    const vaccine = data.vaccineStock.find((vaccine) => vaccine.id === req.params.vaccineId)
    if (!vaccine) { res.redirect('/vaccines'); return }

    const currentOrganisationSites = res.locals.currentOrganisation.sites || []
    const site = currentOrganisationSites.find((site) => site.id == vaccine.siteId)


    const batch = vaccine.batches.find((batch) => batch.batchNumber === req.params.batchNumber)
    if (!batch) { res.redirect(`/vaccines/${vaccine.id}`); return }

    res.render('vaccines/reactivate', {
      vaccine,
      site,
      batch
    })
  })

  // Mark batch as active again
  router.post('/vaccines/:vaccineId/:batchNumber/reactivated', (req, res) => {
    const data = req.session.data
    const vaccine = data.vaccineStock.find((vaccine) => vaccine.id === req.params.vaccineId)
    if (!vaccine) { res.redirect('/vaccines'); return }
    const batch = vaccine.batches.find((batch) => batch.batchNumber === req.params.batchNumber)

    batch.depletedDate = null

    res.redirect('/vaccines/' + vaccine.id)
  })
}
