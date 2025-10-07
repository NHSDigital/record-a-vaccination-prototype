const { randomItem } = require('../lib/utils/random-item.js')

module.exports = router => {

    const listOfFirstNames = ["Scott", "Siera", "Ramsey", "Blair", "Gretchen", "Kelli", "Sheridan", "Anya", "Alexis", "Kegan", "Jamia", "Sunny", "Haley", "Elsa", "Ayanna", "Chiara", "Zander", "Oswaldo", "Paris", "Bennett", "Reyna", "Camryn", "Nehemiah", "Craig", "Jalil", "Derick", "Easton", "Mohammed", "Arnold", "Linnea", "Edna", "Cameron", "Gissell", "Melina", "Annalise", "Jalin", "Aric", "Kentrell", "Nyla", "Leslie", "Maranda", "Kinley", "Montana", "Britney", "Uriah", "Raul", "Vincent", "Dustin", "Grant", "Kia"]

    const listOfLastNames = ["Menendez", "Salisbury", "Mateo", "Alarcon", "Lenz", "Potter", "Kramer", "Trevino", "Singleton", "Batchelor", "Witte", "Rhoades", "Barragan", "Watson", "Fiore", "Beattie", "Parr", "Traylor", "Gillette", "Kim", "Fennell", "Eubanks", "Ko", "Mcfarlane", "Waite", "Gaines", "Rosado", "Rao", "Bynum", "Wentz", "Cheng", "Loera", "Hyman", "Ferrell", "Nixon", "Pierre", "Strand", "Wirth", "Delagarza", "Dixon", "Yoon", "Hines", "Hinds", "Barron", "Bruce", "Pease", "Rhodes", "Doss", "Marsh", "France"]

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
    const site = currentOrganisation.sites.find((site) => site.id === siteId)
    const lists = req.session.data.lists.filter((list) => list.organisationId === currentOrganisation.id).filter((list) => list.siteId === siteId)

    let justAddedList = null
    if (req.query.justAddedId) {
      justAddedList = req.session.data.lists.find((list) => list.id == req.query.justAddedId)
    }

    res.render('lists/team-lists', {
      lists,
      site,
      justAddedList
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

    if (date === '') {

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
        nhsNumber: nhsNumber,
        firstName: randomItem(listOfFirstNames),
        lastName: randomItem(listOfLastNames),
        dateOfBirth: "1945-01-18"
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

    res.redirect(`/lists/site/${siteId}?justAddedId=${id}`)

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

  router.get('/lists/list/:id/edit-name', (req, res) => {
    const data = req.session.data
    const id = req.params.id
    const patientList = data.lists.find((list) => list.id === id)

    if (!patientList) { return res.redirect('/lists') }

    res.render('lists/edit-name', {
      patientList
    })
  })

  router.post('/lists/:id/update-name', (req, res) => {
    const data = req.session.data
    const id = req.params.id
    const patientList = data.lists.find((list) => list.id === id)

    if (!patientList) { return res.redirect('/lists') }

    patientList.name = data.name

    res.redirect(`/lists/list/${patientList.id}`)
  })

  router.get('/lists/list/:id/add', (req, res) => {
    const data = req.session.data
    const id = req.params.id
    const patientList = data.lists.find((list) => list.id === id)

    if (!patientList) { return res.redirect('/lists') }

    res.render('lists/add-more-nhs-numbers', {
      patientList
    })
  })

  router.post('/lists/:id/nhs-numbers-added', (req, res) => {
    const data = req.session.data
    const id = req.params.id
    const patientList = data.lists.find((list) => list.id === id)

    if (!patientList) { return res.redirect('/lists') }

    const nhsNumbers = data.nhsNumbers.split(/\n/)

    for (nhsNumber of nhsNumbers) {
      patientList.patients.push({
        nhsNumber: nhsNumber,
        firstName: randomItem(listOfFirstNames),
        lastName: randomItem(listOfLastNames),
        dateOfBirth: "1945-01-18"
      })
    }

    // reset values
    data.date = null
    data.name = null
    data.nhsNumbers = null

    res.redirect(`/lists/list/${patientList.id}`)

  })

  router.get('/lists/list/:id/delete', (req, res) => {
    const data = req.session.data
    const id = req.params.id
    const patientList = data.lists.find((list) => list.id === id)

    if (!patientList) { return res.redirect('/lists') }

    res.render('lists/delete', {
      patientList
    })
  })

  router.post('/lists/:id/deleted', (req, res) => {
    const data = req.session.data
    const id = req.params.id
    const patientList = data.lists.find((list) => list.id === id)
    const siteId = patientList.siteId

    if (!patientList) { return res.redirect('/lists') }

    // Remove item from array using 'splice', which takes an index
    data.lists.splice(data.lists.indexOf(patientList), 1)

    res.redirect(`/lists/site/${siteId}?justDeleted=true`)

  })


}
