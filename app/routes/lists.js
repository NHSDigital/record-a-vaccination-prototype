module.exports = router => {

  router.get('/lists', (req, res) => {
    const currentOrganisation = res.locals.currentOrganisation
    const lists = req.session.data.lists.filter((list) => list.organisationId === currentOrganisation.id)

    const listSiteIds = [...new Set(lists.map((list) => list.siteId))]
    const sites = currentOrganisation.sites.filter((site) => listSiteIds.includes(site.id))

    if (lists.length === 0) {
      res.render('lists/no-lists-created')
    } else {
      res.render('lists/index', {
        sites
      })
    }
  })

  router.get('/lists/site/:siteId', (req, res) => {
    const currentOrganisation = res.locals.currentOrganisation
    const siteId = req.params.siteId
    const lists = req.session.data.lists.filter((list) => list.organisationId === currentOrganisation.id).filter((list) => list.siteId === siteId)

    res.render('lists/team-lists', {
      lists
    })
  })

  router.get('/lists/team', (req, res) => {
    const data = req.session.data
    let sites = res.locals.currentOrganisation.sites || []

    const vaccineStock = data.vaccineStock
    const siteIdsWithVaccines = [...new Set(vaccineStock.map((vaccineAdded) => vaccineAdded.siteId))]

    sites = sites.filter((site) => siteIdsWithVaccines.includes(site.id))

    res.render('lists/team', {
      sites
    })

  })

  router.post('/lists/date-answer', (req, res) => {

    const date = req.session.data.date

    if (date === 'no-date') {

      res.redirect('/lists/name')

    } else  {

      res.redirect('/lists/add-nhs-numbers')

    }
  })

  router.post('/lists/create', (req, res) => {
    const data = req.session.data
    const currentOrganisation = res.locals.currentOrganisation

    const date = data.date
    const name = data.name
    const siteId = data.siteId
    const nhsNumbers = data.nhsNumbers.split(/\n/)
    const id = Math.floor(Math.random() * 10000000).toString()

    const patients = nhsNumbers.map(function(nhsNumber) {
      return {
        nhsNumber: nhsNumber
      }
    })

    data.lists.push({
      id: id,
      organisationId: currentOrganisation.id,
      siteId: siteId,
      date: date,
      name: name,
      patients: patients
    })

    // reset values
    data.date = null
    data.name = null
    data.nhsNumbers = null

    res.redirect('/lists')

  })

  router.get('/lists/list/:id', (req, res) => {
    const data = req.session.data
    const id = req.params.id
    const patientList = data.lists.find((list) => list.id === id)

    if (!patientList) { return res.redirect('/lists') }

    res.render('lists/list', {
      patientList
    })
  })

}
