const { dateFromYearMonthDay } = require('../lib/utils/date-from-year-month-day.js')
const { randomItem } = require('../lib/utils/random-item.js')


module.exports = router => {

    const listOfFirstNames = ["Scott", "Siera", "Ramsey", "Blair", "Gretchen", "Kelli", "Sheridan", "Anya", "Alexis", "Kegan", "Jamia", "Sunny", "Haley", "Elsa", "Ayanna", "Chiara", "Zander", "Oswaldo", "Paris", "Bennett", "Reyna", "Camryn", "Nehemiah", "Craig", "Jalil", "Derick", "Easton", "Mohammed", "Arnold", "Linnea", "Edna", "Cameron", "Gissell", "Melina", "Annalise", "Jalin", "Aric", "Kentrell", "Nyla", "Leslie", "Maranda", "Kinley", "Montana", "Britney", "Uriah", "Raul", "Vincent", "Dustin", "Grant", "Kia"]

    const listOfLastNames = ["Menendez", "Salisbury", "Mateo", "Alarcon", "Lenz", "Potter", "Kramer", "Trevino", "Singleton", "Batchelor", "Witte", "Rhoades", "Barragan", "Watson", "Fiore", "Beattie", "Parr", "Traylor", "Gillette", "Kim", "Fennell", "Eubanks", "Ko", "Mcfarlane", "Waite", "Gaines", "Rosado", "Rao", "Bynum", "Wentz", "Cheng", "Loera", "Hyman", "Ferrell", "Nixon", "Pierre", "Strand", "Wirth", "Delagarza", "Dixon", "Yoon", "Hines", "Hinds", "Barron", "Bruce", "Pease", "Rhodes", "Doss", "Marsh", "France"]

  router.get('/lists', (req, res) => {
    const data = req.session.data
    const currentOrganisation = res.locals.currentOrganisation
    const lists = data.lists.filter((list) => list.organisationId === currentOrganisation.id)

    const vaccinesAdded = data.vaccineStock.length

    if (vaccinesAdded === 0) { return res.render('lists/no-vaccines-added') }
    if (lists.length === 0) { return res.render('lists/no-lists-created') }

    const listSiteIds = [...new Set(lists.map((list) => list.siteId))]
    const sites = currentOrganisation.sites.filter((site) => listSiteIds.includes(site.id))

    res.render('lists/index', {
      sites
    })

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

  router.get('/lists/date', (req, res) => {
    const today = new Date()
    const day = 86400000 // number of milliseconds in a day
    const daysToInclude = 5

    let dates = []

    for (let i = 0; i < daysToInclude; i++) {
      let date = new Date(today.getTime() - (i * day))

      dates.push(date.toISOString().substring(0,10))
    }

    res.render('lists/date', {
      dates
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
    const otherDate = data.otherDate
    const name = data.name
    const siteId = data.siteId
    const nhsNumbers = data.nhsNumbers.split(/\n/)
    const id = Math.floor(Math.random() * 10000000).toString()

    // Only 1 of these is set
    let listDate, listName

    if (date === "") {
      // Name based list
      listDate = null
      listName = name
    } else {
      // Date based list
      listName = null

      if (date === "other-date") {
        listDate = dateFromYearMonthDay(otherDate.year, otherDate.month, otherDate.day).toISOString().substring(0,10)
      } else {
        listDate = date
      }
    }

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
      date: listDate,
      name: listName,
      patients: patients
    })

    // reset values
    data.date = null
    data.otherDate = null
    data.name = null
    data.nhsNumbers = null

    res.redirect(`/lists/site/${siteId}?justAddedId=${id}`)

  })

  router.get('/lists/list/:id', (req, res) => {
    const data = req.session.data
    const id = req.params.id
    const q = req.query.q
    const patientList = data.lists.find((list) => list.id === id)

    if (!patientList) { return res.redirect('/lists') }

    const totalPatients = patientList.patients.length

    let patients = patientList.patients

    if (q && q !== "") {

      patients = patients.filter(function(patient) {
        return (
          patient.firstName.toLowerCase().startsWith(q.toLowerCase()) ||
          patient.lastName.toLowerCase().startsWith(q.toLowerCase()) ||
          (patient.firstName + " " + patient.lastName).toLowerCase().startsWith(q.toLowerCase()) ||
          patient.nhsNumber === q
        )

      })
    }

    res.render('lists/list', {
      patientList,
      patients,
      totalPatients
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

    for (let nhsNumber of nhsNumbers) {
      patientList.patients.push({
        nhsNumber: nhsNumber,
        firstName: randomItem(listOfFirstNames),
        lastName: randomItem(listOfLastNames),
        dateOfBirth: "1945-01-18"
      })
    }

    // reset values
    data.date = null
    data.otherDate = {}
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
