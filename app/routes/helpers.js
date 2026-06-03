const { randomItem } = require('../lib/utils/random-item.js')

module.exports = router => {

  const signInScenarioEmails = [
    'jane.smith@nhs.net',
    'henry.blue@nhs.net',
    'jeremy.blue@nhs.net',
    'ocean.merritt@nhs.net',
    'graham.wallace@nhs.net',
    'phoebe.black@nhs.net',
    'paulina.sloan@nhs.net',
    'amanda.white@nhs.net',
    'jason.white@nhs.net',
    'sally.green@nhs.net',
    'kaisley.wells@nhs.net',
    'jeremy13.blue@nhs.net'
  ]

  const buildUserCheckboxItems = (users, selectedUserIds = [], currentUserId = null) => {
    return users.map((user) => {
      let hintText = user.email || ''
      const email = (user.email || '').toLowerCase()

      if (signInScenarioEmails.includes(email)) {
        hintText += ' (Sign-in scenario user)'
      }

      if (currentUserId === user.id) {
        hintText += ' (Currently signed in)'
      }

      return {
        value: user.id,
        text: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        checked: selectedUserIds.includes(user.id),
        hint: {
          text: hintText
        }
      }
    })
  }

  router.get('/prototype-setup/setup-batches', (req, res) => {
    const data = req.session.data
    const currentOrganisation = res.locals.currentOrganisation
    const currentSiteIds = currentOrganisation.sites.map((site) => site.id)

    let vaccineStock = data.vaccineStock

    const organisationVaccines = currentOrganisation.vaccines

    const dateNow = new Date()
    const millisecondsPerDay = 86400000

    const vaccines = data.vaccines
    const siteId = randomItem(currentSiteIds)

    for (let vaccine of vaccines) {

      const organisationVaccine = organisationVaccines.find((organisationVaccine) => organisationVaccine.name === vaccine.name)

      if (organisationVaccine) {
        organisationVaccine.status = "enabled"
      } else {
        organisationVaccines.push({
          name: vaccine.name,
          status: "enabled"
        })
      }

      for (let vaccineProduct of vaccine.products) {

        const numberOfBatchesToAdd = 1 + Math.floor(Math.random() * 40)

        let batchesToAdd = []

        const generatedVaccineId = Math.floor(Math.random() * 10000000).toString()

        for (let step = 0; step < numberOfBatchesToAdd; step++) {

          const generatedBatchId = Math.floor(Math.random() * 10000000).toString()
          const generatedBatchNumber = "AB" + Math.floor(Math.random() * 1000000).toString()

          const generatedExpiryDate = new Date(dateNow.getTime() + (Math.random() * 100 * millisecondsPerDay)).toISOString()

          batchesToAdd.push({
            id: generatedBatchId,
            batchNumber: generatedBatchNumber,
            expiryDate: generatedExpiryDate
          })
        }

        const existingVaccineStockItem = vaccineStock.find((item) => ((item.vaccine === vaccine.name) && (item.vaccineProduct === vaccineProduct.name) && (item.siteId === siteId) && (item.organisationId === currentOrganisation.id)))

        if (existingVaccineStockItem) {
          existingVaccineStockItem.batches.push(...batchesToAdd)
        } else {
          vaccineStock.push({
            id: generatedVaccineId,
            vaccine: vaccine.name,
            vaccineProduct: vaccineProduct.name,
            organisationId: currentOrganisation.id,
            siteId: siteId,
            batches: batchesToAdd
          })
        }

      }
    }

    res.redirect('/vaccines')
  });

  router.get('/prototype-setup/add-vaccinations', (req, res) => {
    const data = req.session.data

    const vaccinesAddedCount = data.vaccineStock.length


    res.render('prototype-setup/add-vaccinations', {
      vaccinesAddedCount
    })
  })

  router.post('/prototype-setup/add-vaccinations', (req, res) => {
    const data = req.session.data
    const currentOrganisation = res.locals.currentOrganisation

    const currentSiteIds = currentOrganisation.sites.map((site) => site.id)

    const listOfFirstNames = ["Susana", "Steven", "Aleah", "Kaylen", "Stephan", "Donavon", "Emely", "Kailee", "Brooks", "Brenton", "Miles", "Emanuel", "Jedidiah", "Glenn", "Jude", "Ivory", "Austen", "Alyson", "Jaime", "Jordin", "Chad", "Janay", "Tahj", "Reginald", "Enoch", "Amiyah", "Benito", "April", "Joelle", "Brant"]

    const listOfLastNames = ["Ross", "Friedman", "Switzer", "Devore", "Dominguez", "Kohn", "Moreau", "Farrar", "Hogue", "Goldsmith", "Wilkins", "Cornwell", "Wimberly", "Messer", "Woods", "Forrest", "Aiello", "Kuykendall", "Trout", "Bigelow", "Moreland", "Lentz", "Hurst", "Quinonez", "Pak", "McNally", "Longo", "Hunt", "Villa", "Breaux"]

    const vaccinationsToAdd = parseInt(data.numberOfVaccinationsToAdd);

    const dateToday = new Date()

    const dayToday = (dateToday.getDate())
    // Months in JavaScript are zero-indexed
    const monthToday = (dateToday.getMonth() + 1)
    const yearToday = (dateToday.getFullYear())

    const organisationVaccines = currentOrganisation.vaccines || []

    const vaccinesEnabled = organisationVaccines
      .filter((vaccine) => vaccine.status === "enabled")

    const vaccinators = data.users.filter(function(user) {
      const userInOrganisation = (user.organisations || []).find((userOrg) => userOrg.id === currentOrganisation.id)

      return (userInOrganisation && userInOrganisation.vaccinator)
    })

    for (let i = 0; i < vaccinationsToAdd; i++) {

      const generatedId = Math.floor(Math.random() * 10000000).toString()
      const randomVaccine = randomItem(vaccinesEnabled)

      const vaccineProductsInStock = data.vaccineStock.filter((vaccineStockItem) => vaccineStockItem.vaccine == randomVaccine.name)

      if (vaccineProductsInStock.length > 0) {

        const randomVaccineProduct = randomItem(vaccineProductsInStock)

        const randombatchNumber = randomItem(randomVaccineProduct.batches)

        const vaccinator = randomItem(vaccinators)

        const randomName = randomItem(listOfFirstNames) + " " + randomItem(listOfLastNames)

        const randomNhsNumber = "9" + (100000000 + Math.floor(Math.random() * 900000000)).toString()

        data.vaccinationsRecorded.push({
          id: generatedId,
          organisationId: currentOrganisation.id,
          siteId: randomItem(currentSiteIds),
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
          vaccinatorId: vaccinator.id,
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
    }

    res.redirect('/records')
  });

  router.get('/prototype-setup/remove-selected-users', (req, res) => {
    const data = req.session.data

    const users = [...data.users].sort((a, b) => {
      const aName = `${a.firstName || ''} ${a.lastName || ''}`.trim().toLowerCase()
      const bName = `${b.firstName || ''} ${b.lastName || ''}`.trim().toLowerCase()

      return aName.localeCompare(bName)
    })

    const checkboxItems = buildUserCheckboxItems(users, [], data.currentUserId)

    res.render('prototype-setup/remove-selected-users', {
      checkboxItems
    })
  })

  router.post('/prototype-setup/remove-selected-users', (req, res) => {
    const data = req.session.data
    const selectedUserIds = req.body.userIds
      ? (Array.isArray(req.body.userIds) ? req.body.userIds : [req.body.userIds])
      : []

    const users = [...data.users].sort((a, b) => {
      const aName = `${a.firstName || ''} ${a.lastName || ''}`.trim().toLowerCase()
      const bName = `${b.firstName || ''} ${b.lastName || ''}`.trim().toLowerCase()

      return aName.localeCompare(bName)
    })

    const checkboxItems = buildUserCheckboxItems(users, selectedUserIds, data.currentUserId)

    if (selectedUserIds.length === 0) {
      res.render('prototype-setup/remove-selected-users', {
        checkboxItems,
        error: {
          text: 'Select at least 1 user to remove'
        }
      })
      return
    }

    data.users = data.users.filter((user) => !selectedUserIds.includes(user.id))

    const currentUserStillExists = data.users.some((user) => user.id === data.currentUserId)
    if (!currentUserStillExists) {
      data.currentUserId = null
      data.currentOrganisationId = null
    }

    res.redirect('/prototype-setup')
  })

  router.get('/prototype-setup/remove-all-users', (req, res) => {
    const data = req.session.data
    const usersToKeep = data.users.filter((user) => signInScenarioEmails.includes((user.email || '').toLowerCase()))
    const usersToRemove = data.users.length - usersToKeep.length

    res.render('prototype-setup/remove-all-users', {
      usersCount: data.users.length,
      usersToKeepCount: usersToKeep.length,
      usersToRemoveCount: usersToRemove,
      vaccinationsCount: data.vaccinationsRecorded.length
    })
  })

  router.post('/prototype-setup/remove-all-users', (req, res) => {
    const data = req.session.data

    data.users = data.users.filter((user) => signInScenarioEmails.includes((user.email || '').toLowerCase()))

    const currentUserStillExists = data.users.some((user) => user.id === data.currentUserId)
    if (!currentUserStillExists) {
      data.currentUserId = null
    }

    res.redirect('/prototype-setup')
  })


  router.post('/prototype-setup/add-users', (req, res) => {
    const data = req.session.data
    const currentOrganisation = res.locals.currentOrganisation

    const listOfFirstNames = ["Susana", "Steven", "Aleah", "Kaylen", "Stephan", "Donavon", "Emely", "Kailee", "Brooks", "Brenton", "Miles", "Emanuel", "Jedidiah", "Glenn", "Jude", "Ivory", "Austen", "Alyson", "Jaime", "Jordin", "Chad", "Janay", "Tahj", "Reginald", "Enoch", "Amiyah", "Benito", "April", "Joelle", "Brant"]

    const listOfLastNames = ["Ross", "Friedman", "Switzer", "Devore", "Dominguez", "Kohn", "Moreau", "Farrar", "Hogue", "Goldsmith", "Wilkins", "Cornwell", "Wimberly", "Messer", "Woods", "Forrest", "Aiello", "Kuykendall", "Trout", "Bigelow", "Moreland", "Lentz", "Hurst", "Quinonez", "Pak", "McNally", "Longo", "Hunt", "Villa", "Breaux"]


    const usersToAdd = parseInt(data.numberOfUsersToAdd);

    const permissionLevels = ["Recorder", "Administrator", "Lead administrator"]


    for (let i = 0; i < usersToAdd; i++) {
      const generatedId = Math.floor(Math.random() * 10000000).toString()

      const generatedEmailId = Math.floor(Math.random() * 10).toString()

      const randomFirstName = randomItem(listOfFirstNames)
      const randomLastName = randomItem(listOfLastNames)

      data.users.push({
        id: generatedId,
        email: `${randomFirstName.toLowerCase()}.${randomLastName.toLowerCase()}${generatedEmailId}@nhs.net`,
        organisations: [
          {
            id: currentOrganisation.id,
            permissionLevel: randomItem(permissionLevels),
            status: "Active",
            vaccinator: randomItem([true, true, false])
          }
        ],
        firstName: randomFirstName,
        lastName: randomLastName
      })
    }

    res.redirect('/user-admin')
  });

}
