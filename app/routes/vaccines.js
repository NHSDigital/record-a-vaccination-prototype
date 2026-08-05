module.exports = (router) => {

  router.get('/vaccines', (req, res) => {
    const currentOrganisation = res.locals.currentOrganisation
    const data = req.session.data
    const deactivatedSite = req.query.deactivatedSite === 'true'
    const reactivatedSite = req.query.reactivatedSite === 'true'
    const siteName = req.query.siteName
    const siteTab = (req.query.siteTab || 'active').toLowerCase()
    const validSiteTabs = ['active', 'deactivated']
    const currentSiteTab = validSiteTabs.includes(siteTab) ? siteTab : 'active'

    const organisationVaccines = res.locals.currentOrganisation.vaccines || []

    const vaccinesEnabledNames = organisationVaccines
      .filter((vaccine) => vaccine.status === "enabled")
      .map((vaccine) => vaccine.name)

    const allVaccines = data.vaccines

    const vaccinesThatCanBeRequested =  allVaccines
      .filter((vaccine) => vaccine.availableToAllSites)
      .filter((vaccine) => !vaccinesEnabledNames.includes(vaccine.name))
      .map((vaccine) => vaccine.name)

    const vaccineStock = data.vaccineStock.filter((vaccine) => vaccine.organisationId === currentOrganisation.id)
    const siteIdsInUse = [...new Set(vaccineStock.map((vaccine) => vaccine.siteId))]
    const sitesInUse = (currentOrganisation.sites || []).filter((site) => siteIdsInUse.includes(site.id))
    const activeSitesCount = sitesInUse.filter((site) => site.status !== 'closed').length
    const deactivatedSitesCount = sitesInUse.filter((site) => site.status === 'closed').length

    res.render('vaccines/index', {
      vaccineStock,
      vaccinesThatCanBeRequested,
      deactivatedSite,
      reactivatedSite,
      siteName,
      currentSiteTab,
      activeSitesCount,
      deactivatedSitesCount
    })
  })

  // Adding a vaccine
  router.post('/vaccines/add', (req, res) => {
    const currentOrganisation = res.locals.currentOrganisation
    const data = req.session.data

    const generatedId = Math.floor(Math.random() * 10000000).toString()

    const expiryDate = new Date(data.batchExpiryDate.year, (parseInt(data.batchExpiryDate.month) - 1), data.batchExpiryDate.day, 12).toISOString().substring(0,10)

    data.vaccineStock.push({
      id: generatedId,
      vaccine: data.vaccine,
      vaccineProduct: data.vaccineProduct,
      organisationId: currentOrganisation.id,
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

    const organisationVaccines = res.locals.currentOrganisation.vaccines || []

    const vaccinesEnabledNames = organisationVaccines
      .filter((vaccine) => vaccine.status === "enabled")
      .map((vaccine) => vaccine.name)

    const allVaccines = data.vaccines

    const vaccinesEnabled = allVaccines.filter((vaccine) => vaccinesEnabledNames.includes(vaccine.name))

    const vaccinesThatCanBeRequested =  allVaccines
    .filter((vaccine) => vaccine.availableToAllSites)
    .filter((vaccine) => !vaccinesEnabledNames.includes(vaccine.name))
    .map((vaccine) => vaccine.name)


    res.render('vaccines/choose-vaccine', {
      vaccinesEnabled,
      vaccinesThatCanBeRequested
    })
  })

  // Enabling a new vaccine type
  router.post('/vaccines/enable', (req, res) => {

    const data = req.session.data
    const currentOrganisation = res.locals.currentOrganisation

    const vaccinesAdded = data.vaccinesAdded

    for (const vaccine of vaccinesAdded) {

      currentOrganisation.vaccines ||= []

      let vaccineToEnable = currentOrganisation.vaccines.find((vaccine) => vaccine.name === vaccine)

      if (vaccineToEnable) {
        vaccineToEnable.status = "enabled"

      } else {

        currentOrganisation.vaccines.push({
          name: vaccine,
          status: "enabled"
        })
      }
    }

    res.redirect('/vaccines/choose-vaccine')
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

  // View page to deactivate a site
  router.get('/vaccines/sites/:siteId/deactivate', (req, res) => {
    const currentOrganisationSites = res.locals.currentOrganisation.sites || []
    const site = currentOrganisationSites.find((item) => item.id === req.params.siteId)
    if (!site) { res.redirect('/vaccines'); return }

    res.render('vaccines/deactivate-site', {
      site
    })
  })

  // Mark site as closed
  router.post('/vaccines/sites/:siteId/deactivated', (req, res) => {
    const currentOrganisationSites = res.locals.currentOrganisation.sites || []
    const site = currentOrganisationSites.find((item) => item.id === req.params.siteId)
    if (!site) { res.redirect('/vaccines'); return }

    site.status = 'closed'

    res.redirect(`/vaccines?siteTab=deactivated&deactivatedSite=true&siteName=${encodeURIComponent(site.name)}`)
  })

  // View page to reactivate a site
  router.get('/vaccines/sites/:siteId/reactivate', (req, res) => {
    const currentOrganisationSites = res.locals.currentOrganisation.sites || []
    const site = currentOrganisationSites.find((item) => item.id === req.params.siteId)
    if (!site) { res.redirect('/vaccines'); return }

    res.render('vaccines/reactivate-site', {
      site
    })
  })

  // Mark site as active
  router.post('/vaccines/sites/:siteId/reactivated', (req, res) => {
    const currentOrganisationSites = res.locals.currentOrganisation.sites || []
    const site = currentOrganisationSites.find((item) => item.id === req.params.siteId)
    if (!site) { res.redirect('/vaccines'); return }

    delete site.status

    res.redirect(`/vaccines?siteTab=active&reactivatedSite=true&siteName=${encodeURIComponent(site.name)}`)
  })


  // Adding a batch to an existing vaccine at a site
  router.post('/vaccines/:id/added', (req, res) => {
    const data = req.session.data
    const vaccine = data.vaccineStock.find((vaccine) => vaccine.id === req.params.id)
    if (!vaccine) { res.redirect('/vaccines'); return }

    const generatedId = Math.floor(Math.random() * 10000000).toString()

    const expiryDate = new Date(data.batchExpiryDate.year, (parseInt(data.batchExpiryDate.month) - 1), data.batchExpiryDate.day, 12).toISOString().substring(0,10)

    const matchingDeactivatedBatch = vaccine.batches.find((batch) => {
      return batch.batchNumber === data.batchNumber && batch.expiryDate === expiryDate && batch.deactivatedDate
    })

    if (matchingDeactivatedBatch) {
      res.redirect(`/vaccines/${vaccine.id}/add-batch-check`)
      return
    }

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
    const queryPage = parseInt(req.query.page) || 1  ;  // Current page, default to 1
    const tab = (req.query.tab || 'active').toLowerCase()
    const deactivated = req.query.deactivated === 'true'
    const reactivated = req.query.reactivated === 'true'
    const updatedBatchNumber = req.query.batchNumber

    const vaccine = data.vaccineStock.find((vaccine) => vaccine.id === req.params.id)
    if (!vaccine) { res.redirect('/vaccines'); return }

    const currentOrganisation = res.locals.currentOrganisation

    const site = currentOrganisation.sites.find((site) => site.id === vaccine.siteId)

    const today = new Date().toISOString().substring(0,10)
    const validTabs = ['active', 'inactive']
    const currentTab = validTabs.includes(tab) ? tab : 'active'

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

    const isActiveBatch = (batch) => {
      return !batch.deactivatedDate && batch.expiryDate >= today
    }

    const batchesByStatus = {
      active: allBatches.filter((batch) => isActiveBatch(batch)),
      inactive: allBatches.filter((batch) => !isActiveBatch(batch))
    }

    const filteredBatches = batchesByStatus[currentTab]
    const totalBatches = filteredBatches.length
    const totalPages = Math.ceil(totalBatches / perPage)
    const page = totalPages > 0 ? Math.min(queryPage, totalPages) : 1
    const indexStartFrom = (page - 1) * perPage
    const batches = filteredBatches.slice(indexStartFrom, indexStartFrom + perPage)


    res.render('vaccines/product-page', {
      vaccine,
      batches,
      site,
      today,
      totalPages,
      totalBatches,
      page,
      currentTab,
      activeBatchesCount: batchesByStatus.active.length,
      inactiveBatchesCount: batchesByStatus.inactive.length,
      deactivated,
      reactivated,
      updatedBatchNumber
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

    let matchingDeactivatedBatch
    const { day, month, year } = data.batchExpiryDate || {}

    if (data.batchNumber && day && month && year) {
      const expiryDate = new Date(year, (parseInt(month) - 1), day, 12).toISOString().substring(0,10)

      matchingDeactivatedBatch = vaccine.batches.find((batch) => {
        return batch.batchNumber === data.batchNumber && batch.expiryDate === expiryDate && batch.deactivatedDate
      })
    }

    res.render('vaccines/add-batch-to-site-check', {
      vaccine,
      site,
      matchingDeactivatedBatch,
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

  // View page to deactivate a batch
  router.get('/vaccines/:vaccineId/:batchNumber/deactivate', (req, res) => {
    const data = req.session.data
    const vaccine = data.vaccineStock.find((vaccine) => vaccine.id === req.params.vaccineId)
    if (!vaccine) { res.redirect('/vaccines'); return }

    const currentOrganisationSites = res.locals.currentOrganisation.sites || []
    const site = currentOrganisationSites.find((site) => site.id == vaccine.siteId)

    const batch = vaccine.batches.find((batch) => batch.batchNumber === req.params.batchNumber)
    if (!batch) { res.redirect(`/vaccines/${vaccine.id}`); return }

    res.render('vaccines/deactivate-batch', {
      vaccine,
      site,
      batch
    })
  })

  // Mark batch as deactivated
  router.post('/vaccines/:vaccineId/:batchNumber/deactivated', (req, res) => {
    const data = req.session.data
    const vaccine = data.vaccineStock.find((vaccine) => vaccine.id === req.params.vaccineId)
    if (!vaccine) { res.redirect('/vaccines'); return }
    const batch = vaccine.batches.find((batch) => batch.batchNumber === req.params.batchNumber)

    let deactivatedDate = new Date()

    batch.deactivatedDate = deactivatedDate.toISOString().substring(0,10)

    res.redirect(`/vaccines/${vaccine.id}?tab=inactive&deactivated=true&batchNumber=${encodeURIComponent(batch.batchNumber)}`)
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

    batch.deactivatedDate = null

    res.redirect(`/vaccines/${vaccine.id}?tab=active&reactivated=true&batchNumber=${encodeURIComponent(batch.batchNumber)}`)
  })
}
