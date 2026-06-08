const sessionDataDefaults = require('../data/session-data-defaults')
const { randomItem } = require('../lib/utils/random-item')

const SIGN_IN_USERS = [
  {
    id: '2387441662601',
    name: 'Jane Smith',
    email: 'jane.smith@nhs.net',
    orgId: 'RW3',
    role: 'Lead administrator',
    orgDescription: 'NHS Trust (RW3)'
  },
  {
    id: '16346346361',
    name: 'Henry Blue',
    email: 'henry.blue@nhs.net',
    orgId: 'RV3',
    role: 'Lead administrator',
    orgDescription: 'new NHS Trust (RV3) — no existing data'
  },
  {
    id: '3283602393037',
    name: 'Graham Wallace',
    email: 'graham.wallace@nhs.net',
    orgId: 'RWP',
    role: 'Recorder',
    orgDescription: 'multiple NHS Trusts (RWP, RXX, RAP)'
  },
  {
    id: '2058253531',
    name: 'Phoebe Black',
    email: 'phoebe.black@nhs.net',
    orgId: 'RWP',
    role: 'Lead administrator / administrator',
    orgDescription: 'multiple NHS Trusts (RWP, RXX)'
  },
  {
    id: '9847489647892',
    name: 'Paulina Sloan',
    email: 'paulina.sloan@nhs.net',
    orgId: 'P0191N',
    role: 'Group administrator',
    orgDescription: 'P.W. Pharmacies chain (P0191N)'
  },
  {
    id: '6424325235325',
    name: 'Amanda White',
    email: 'amanda.white@nhs.net',
    orgId: 'P15951',
    role: 'Group administrator',
    orgDescription: 'MediCare Health chain (P15951)'
  },
  {
    id: '46436346',
    name: 'Jeremy Blue',
    email: 'jeremy.blue@nhs.net',
    orgId: 'FA424',
    role: 'Lead administrator',
    orgDescription: 'Pickfords Pharmacy (FA424)'
  },
  {
    id: '1394978032564',
    name: 'Ocean Merritt',
    email: 'ocean.merritt@nhs.net',
    orgId: 'FR4V56',
    role: 'Recorder',
    orgDescription: 'pharmacy (FR4V56)'
  },
  {
    id: '5960938237423',
    name: 'Kaisley Wells',
    email: 'kaisley.wells@nhs.net',
    orgId: 'RFF',
    role: 'Lead administrator',
    orgDescription: 'NHS Trust with all vaccines enabled (RFF)'
  },
  {
    id: '636436353252',
    name: 'Jason White',
    email: 'jason.white@nhs.net',
    orgId: 'Y56',
    role: 'Regions interface user',
    orgDescription: 'region (Y56)'
  },
  {
    id: '66435353634',
    name: 'Sally Green',
    email: 'sally.green@nhs.net',
    orgId: null,
    role: 'Support admin',
    orgDescription: 'system-wide support admin'
  },
  {
    id: '633464144',
    name: 'Jeremy Blue (Holborn)',
    email: 'jeremy13.blue@nhs.net',
    orgId: 'FT81513',
    role: 'Lead administrator',
    orgDescription: 'Holborn Pharmacy (FT81513) — MMR and London flu only'
  },
  {
    id: '5500000001',
    name: 'Riley Carter',
    email: 'riley.carter@nhs.net',
    orgId: 'FR4V56',
    role: 'Recorder',
    orgDescription: 'pharmacy (FR4V56), no appointments interface',
    appointmentsInterfaceEnabled: false
  }
]

const listOfFirstNames = ['Susana', 'Steven', 'Aleah', 'Kaylen', 'Stephan', 'Donavon', 'Emely', 'Kailee', 'Brooks', 'Brenton', 'Miles', 'Emanuel', 'Jedidiah', 'Glenn', 'Jude', 'Ivory', 'Austen', 'Alyson', 'Jaime', 'Jordin', 'Chad', 'Janay', 'Tahj', 'Reginald', 'Enoch', 'Amiyah', 'Benito', 'April', 'Joelle', 'Brant']
const listOfLastNames = ['Ross', 'Friedman', 'Switzer', 'Devore', 'Dominguez', 'Kohn', 'Moreau', 'Farrar', 'Hogue', 'Goldsmith', 'Wilkins', 'Cornwell', 'Wimberly', 'Messer', 'Woods', 'Forrest', 'Aiello', 'Kuykendall', 'Trout', 'Bigelow', 'Moreland', 'Lentz', 'Hurst', 'Quinonez', 'Pak', 'McNally', 'Longo', 'Hunt', 'Villa', 'Breaux']

module.exports = (router) => {

  // ----------------------------------------------------------------
  // Shared helper functions
  // ----------------------------------------------------------------

  function resetSession(req) {
    req.session.data = JSON.parse(JSON.stringify(sessionDataDefaults))
  }

  function getSelectedProductsByVaccine(selectedProductValues) {
    const productsByVaccine = {}
    const productValueDelimiter = '__product__'

    for (const selectedValue of selectedProductValues || []) {
      const delimiterIndex = selectedValue.indexOf(productValueDelimiter)
      if (delimiterIndex === -1) continue

      const vaccineName = selectedValue.slice(0, delimiterIndex)
      const productName = selectedValue.slice(delimiterIndex + productValueDelimiter.length)
      if (!vaccineName || !productName) continue

      productsByVaccine[vaccineName] ||= []
      if (!productsByVaccine[vaccineName].includes(productName)) {
        productsByVaccine[vaccineName].push(productName)
      }
    }

    return productsByVaccine
  }

  function setupBatchesForOrg(data, orgId) {
    const org = data.organisations.find(o => o.id === orgId)
    if (!org) return

    const siteId = org.sites && org.sites.length > 0 ? org.sites[0].id : null
    const millisecondsPerDay = 86400000
    const dateNow = new Date()

    org.vaccines = org.vaccines || []

    for (const vaccine of data.vaccines) {
      const existing = org.vaccines.find(v => v.name === vaccine.name)
      if (existing) {
        existing.status = 'enabled'
      } else {
        org.vaccines.push({ name: vaccine.name, status: 'enabled' })
      }

      for (const product of vaccine.products) {
        const numberOfBatches = 1 + Math.floor(Math.random() * 40)
        const batches = []
        for (let i = 0; i < numberOfBatches; i++) {
          batches.push({
            id: Math.floor(Math.random() * 10000000).toString(),
            batchNumber: 'AB' + Math.floor(Math.random() * 1000000).toString(),
            expiryDate: new Date(dateNow.getTime() + Math.random() * 100 * millisecondsPerDay).toISOString()
          })
        }

        const existingStock = data.vaccineStock.find(item =>
          item.vaccine === vaccine.name &&
          item.vaccineProduct === product.name &&
          item.siteId === siteId &&
          item.organisationId === orgId
        )
        if (existingStock) {
          existingStock.batches.push(...batches)
        } else {
          data.vaccineStock.push({
            id: Math.floor(Math.random() * 10000000).toString(),
            vaccine: vaccine.name,
            vaccineProduct: product.name,
            organisationId: orgId,
            siteId: siteId,
            batches: batches
          })
        }
      }
    }
  }

  function setupBatchesForOrgVaccines(data, orgId, enabledVaccineNames, batchesPerProduct, selectedProductsByVaccine) {
    const org = data.organisations.find(o => o.id === orgId)
    if (!org) return

    const siteId = org.sites && org.sites.length > 0 ? org.sites[0].id : null
    const millisecondsPerDay = 86400000
    const dateNow = new Date()

    org.vaccines = data.vaccines.map(v => ({
      name: v.name,
      status: enabledVaccineNames.includes(v.name) ? 'enabled' : 'disabled'
    }))

    for (const vaccine of data.vaccines) {
      if (!enabledVaccineNames.includes(vaccine.name)) continue

      const selectedProducts = selectedProductsByVaccine
        ? selectedProductsByVaccine[vaccine.name]
        : null
      const matchedProducts = selectedProducts && selectedProducts.length > 0
        ? vaccine.products.filter(product => selectedProducts.includes(product.name))
        : vaccine.products
      const productsToAdd = matchedProducts.length > 0 ? matchedProducts : vaccine.products

      for (const product of productsToAdd) {
        const numberOfBatches = Number.isInteger(batchesPerProduct)
          ? batchesPerProduct
          : 1 + Math.floor(Math.random() * 40)
        const batches = []
        for (let i = 0; i < numberOfBatches; i++) {
          batches.push({
            id: Math.floor(Math.random() * 10000000).toString(),
            batchNumber: 'AB' + Math.floor(Math.random() * 1000000).toString(),
            expiryDate: new Date(dateNow.getTime() + Math.random() * 100 * millisecondsPerDay).toISOString()
          })
        }

        const existingStock = data.vaccineStock.find(item =>
          item.vaccine === vaccine.name &&
          item.vaccineProduct === product.name &&
          item.siteId === siteId &&
          item.organisationId === orgId
        )
        if (existingStock) {
          existingStock.batches.push(...batches)
        } else {
          data.vaccineStock.push({
            id: Math.floor(Math.random() * 10000000).toString(),
            vaccine: vaccine.name,
            vaccineProduct: product.name,
            organisationId: orgId,
            siteId: siteId,
            batches: batches
          })
        }
      }
    }
  }

  function addRandomUsers(data, orgId, count) {
    const permissionLevels = ['Recorder', 'Administrator', 'Lead administrator']
    for (let i = 0; i < count; i++) {
      const firstName = randomItem(listOfFirstNames)
      const lastName = randomItem(listOfLastNames)
      data.users.push({
        id: Math.floor(Math.random() * 10000000).toString(),
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 10)}@nhs.net`,
        organisations: [{
          id: orgId,
          permissionLevel: randomItem(permissionLevels),
          status: 'Active',
          vaccinator: randomItem([true, true, false])
        }],
        firstName,
        lastName
      })
    }
  }

  function addRandomVaccinations(data, orgId, count) {
    const org = data.organisations.find(o => o.id === orgId)
    if (!org) return

    const siteIds = org.sites && org.sites.length > 0 ? org.sites.map(s => s.id) : [orgId]
    const orgVaccines = (org.vaccines || []).filter(v => v.status === 'enabled')
    const vaccinators = data.users.filter(u =>
      (u.organisations || []).some(userOrg => userOrg.id === orgId && userOrg.vaccinator)
    )
    const dateNow = new Date()

    for (let i = 0; i < count; i++) {
      const randomVaccine = randomItem(orgVaccines)
      if (!randomVaccine) continue

      const stockForVaccine = data.vaccineStock.filter(s =>
        s.vaccine === randomVaccine.name && s.organisationId === orgId
      )
      if (!stockForVaccine.length) continue

      const randomStock = randomItem(stockForVaccine)
      const randomBatch = randomItem(randomStock.batches)
      const vaccinator = vaccinators.length > 0 ? randomItem(vaccinators) : null

      data.vaccinationsRecorded.push({
        id: Math.floor(Math.random() * 10000000).toString(),
        organisationId: orgId,
        siteId: randomItem(siteIds),
        date: {
          day: dateNow.getDate().toString(),
          month: (dateNow.getMonth() + 1).toString(),
          year: dateNow.getFullYear().toString()
        },
        vaccine: randomVaccine.name,
        vaccineProduct: randomStock.vaccineProduct,
        patient: {
          name: `${randomItem(listOfFirstNames)} ${randomItem(listOfLastNames)}`,
          nhsNumber: '9' + (100000000 + Math.floor(Math.random() * 900000000)).toString()
        },
        batchNumber: randomBatch ? randomBatch.batchNumber : '',
        batchExpiryDate: '2025-01-05',
        vaccinatorId: vaccinator ? vaccinator.id : null,
        eligibility: ['Pregnant'],
        pregnancyDueDate: { day: '04', month: '02', year: '2025' },
        consent: 'Patient',
        injectionSite: 'Left arm',
        notes: '',
        editable: true
      })
    }
  }

  function ensureUserExistsForScenario(data, scenarioUser) {
    if (!scenarioUser) return

    const existing = data.users.find(user => user.id === scenarioUser.id)
    if (existing) return

    const permissionLevel = scenarioUser.role === 'Recorder'
      ? 'Recorder'
      : (scenarioUser.role === 'Group administrator' ? 'Group administrator' : 'Lead administrator')

    data.users.push({
      id: scenarioUser.id,
      email: scenarioUser.email,
      organisations: scenarioUser.orgId
        ? [{
            id: scenarioUser.orgId,
            permissionLevel,
            status: 'Active',
            vaccinator: true
          }]
        : undefined,
      firstName: (scenarioUser.name || '').split(' ')[0] || 'User',
      lastName: (scenarioUser.name || '').split(' ').slice(1).join(' ') || 'Scenario'
    })
  }

  // ----------------------------------------------------------------
  // Reset data
  // ----------------------------------------------------------------

  router.post('/prototype-admin/reset-data', (req, res) => {
    req.session.data = {}
    res.redirect('/')
  })

  // ----------------------------------------------------------------
  // Preset: NHS Trust Lead Admin (Jane Smith, RW3)
  // ----------------------------------------------------------------

  router.get('/prototype-setup/preset/trust-lead-admin', (req, res) => {
    resetSession(req)
    const data = req.session.data
    data.currentUserId = '2387441662601'
    data.currentOrganisationId = 'RW3'
    setupBatchesForOrg(data, 'RW3')
    addRandomUsers(data, 'RW3', 2)
    addRandomVaccinations(data, 'RW3', 2)
    res.redirect('/home')
  })

  // ----------------------------------------------------------------
  // Preset: Pharmacy Lead Admin (Jeremy Blue, FA424)
  // ----------------------------------------------------------------

  router.get('/prototype-setup/preset/pharmacy-lead-admin', (req, res) => {
    resetSession(req)
    const data = req.session.data
    data.currentUserId = '46436346'
    data.currentOrganisationId = 'FA424'
    setupBatchesForOrg(data, 'FA424')
    addRandomUsers(data, 'FA424', 10)
    addRandomVaccinations(data, 'FA424', 30)
    res.redirect('/home')
  })

  // ----------------------------------------------------------------
  // Preset: Pharmacy Group Admin, small chain (Paulina Sloan, P0191N)
  // ----------------------------------------------------------------

  router.get('/prototype-setup/preset/pharmacy-group-admin-small', (req, res) => {
    resetSession(req)
    const data = req.session.data
    data.currentUserId = '9847489647892'
    data.currentOrganisationId = 'P0191N'
    setupBatchesForOrg(data, 'P0191N')
    res.redirect('/home')
  })

  // ----------------------------------------------------------------
  // Preset: Recorder, multiple NHS Trusts (Graham Wallace, RWP)
  // ----------------------------------------------------------------

  router.get('/prototype-setup/preset/recorder-multi-trust', (req, res) => {
    resetSession(req)
    const data = req.session.data
    data.currentUserId = '3283602393037'
    data.currentOrganisationId = 'RWP'
    setupBatchesForOrg(data, 'RWP')
    addRandomVaccinations(data, 'RWP', 20)
    res.redirect('/home')
  })

  // ----------------------------------------------------------------
  // Preset: Trust Lead Admin, no vaccines set up (Henry Blue, RV3)
  // ----------------------------------------------------------------

  router.get('/prototype-setup/preset/trust-lead-admin-no-vaccines', (req, res) => {
    resetSession(req)
    const data = req.session.data
    data.currentUserId = '16346346361'
    data.currentOrganisationId = 'RV3'
    res.redirect('/home')
  })

  // ----------------------------------------------------------------
  // Preset: Administrator at 2 NHS Trusts (Phoebe Black, RWP)
  // ----------------------------------------------------------------

  router.get('/prototype-setup/preset/admin-two-trusts', (req, res) => {
    resetSession(req)
    const data = req.session.data
    data.currentUserId = '2058253531'
    data.currentOrganisationId = 'RWP'
    setupBatchesForOrg(data, 'RWP')
    addRandomUsers(data, 'RWP', 10)
    addRandomVaccinations(data, 'RWP', 20)
    res.redirect('/home')
  })

  // ----------------------------------------------------------------
  // Preset: Pharmacy Group Admin, large chain (Amanda White, P15951)
  // ----------------------------------------------------------------

  router.get('/prototype-setup/preset/pharmacy-group-admin-large', (req, res) => {
    resetSession(req)
    const data = req.session.data
    data.currentUserId = '6424325235325'
    data.currentOrganisationId = 'P15951'
    setupBatchesForOrg(data, 'P15951')
    res.redirect('/home')
  })

  // ----------------------------------------------------------------
  // Preset: Recorder, single organisation (Ocean Merritt, FR4V56)
  // ----------------------------------------------------------------

  router.get('/prototype-setup/preset/recorder-single', (req, res) => {
    resetSession(req)
    const data = req.session.data
    data.currentUserId = '1394978032564'
    data.currentOrganisationId = 'FR4V56'
    res.redirect('/home')
  })

  // ----------------------------------------------------------------
  // Preset: Trust with all vaccines (Kaisley Wells, RFF)
  // ----------------------------------------------------------------

  router.get('/prototype-setup/preset/all-vaccines-trust', (req, res) => {
    resetSession(req)
    const data = req.session.data
    data.currentUserId = '5960938237423'
    data.currentOrganisationId = 'RFF'
    setupBatchesForOrg(data, 'RFF')
    addRandomUsers(data, 'RFF', 10)
    addRandomVaccinations(data, 'RFF', 30)
    res.redirect('/home')
  })

  // ----------------------------------------------------------------
  // Preset: Regions interface (Jason White, Y56)
  // ----------------------------------------------------------------

  router.get('/prototype-setup/preset/regions', (req, res) => {
    resetSession(req)
    const data = req.session.data
    data.currentUserId = '636436353252'
    data.currentOrganisationId = 'Y56'
    res.redirect('/regions')
  })

  // ----------------------------------------------------------------
  // Preset: Support admin (Sally Green)
  // ----------------------------------------------------------------

  router.get('/prototype-setup/preset/support-admin', (req, res) => {
    resetSession(req)
    const data = req.session.data
    data.currentUserId = '66435353634'
    data.currentOrganisationId = null
    res.redirect('/support/regions')
  })

  // ----------------------------------------------------------------
  // Preset: Limited-vaccine pharmacy (Jeremy Blue Holborn, FT81513)
  // ----------------------------------------------------------------

  router.get('/prototype-setup/preset/limited-vaccine-pharmacy', (req, res) => {
    resetSession(req)
    const data = req.session.data
    data.currentUserId = '633464144'
    data.currentOrganisationId = 'FT81513'
    setupBatchesForOrgVaccines(data, 'FT81513', ['MMR', 'flu (London service)'])
    addRandomVaccinations(data, 'FT81513', 10)
    res.redirect('/home')
  })

  // ----------------------------------------------------------------
  // Preset: Recorder at pharmacy with no appointments interface
  // ----------------------------------------------------------------

  router.get('/prototype-setup/preset/recorder-pharmacy-no-appointments', (req, res) => {
    resetSession(req)
    const data = req.session.data

    const scenarioUser = SIGN_IN_USERS.find(user => user.id === '5500000001')
    ensureUserExistsForScenario(data, scenarioUser)

    data.currentUserId = '5500000001'
    data.currentOrganisationId = 'FR4V56'

    const org = data.organisations.find(organisation => organisation.id === 'FR4V56')
    if (org) {
      org.appointmentsInterfaceEnabled = false
    }

    setupBatchesForOrg(data, 'FR4V56')
    addRandomVaccinations(data, 'FR4V56', 10)
    res.redirect('/home')
  })

  // ----------------------------------------------------------------
  // Custom configuration — Step 1: Choose user
  // ----------------------------------------------------------------

  router.get('/prototype-setup/custom-config', (req, res) => {
    const customConfig = req.session.data.customConfig || {}
    const radioItems = SIGN_IN_USERS.map(user => ({
      value: user.id,
      text: user.name,
      hint: { text: `${user.role} — ${user.orgDescription}` },
      checked: customConfig.userId === user.id
    }))
    res.render('prototype-setup/custom-config-user', { radioItems, customConfig })
  })

  router.post('/prototype-setup/custom-config', (req, res) => {
    if (!req.body.userId) {
      const customConfig = req.session.data.customConfig || {}
      const radioItems = SIGN_IN_USERS.map(user => ({
        value: user.id,
        text: user.name,
        hint: { text: `${user.role} — ${user.orgDescription}` },
        checked: false
      }))
      res.render('prototype-setup/custom-config-user', {
        radioItems,
        customConfig,
        userSelectionError: 'Select a user'
      })
      return
    }
    const selectedUser = SIGN_IN_USERS.find(u => u.id === req.body.userId)
    ensureUserExistsForScenario(req.session.data, selectedUser)
    req.session.data.customConfig = {
      ...(req.session.data.customConfig || {}),
      userId: req.body.userId,
      organisationId: selectedUser ? selectedUser.orgId : null,
      appointmentsInterfaceEnabled: selectedUser ? selectedUser.appointmentsInterfaceEnabled : undefined
    }
    res.redirect('/prototype-setup/custom-config/vaccines')
  })

  // ----------------------------------------------------------------
  // Custom configuration — Step 2: Vaccines
  // ----------------------------------------------------------------

  router.get('/prototype-setup/custom-config/vaccines', (req, res) => {
    const customConfig = req.session.data.customConfig || {}
    const allVaccines = req.session.data.vaccines || []
    const selectedVaccines = customConfig.vaccines || []
    const selectedVaccineProducts = customConfig.vaccineProducts || []
    const productValueDelimiter = '__product__'
    const allVaccinesSelected = allVaccines.length > 0 && allVaccines.every(vaccine => selectedVaccines.includes(vaccine.name))

    const checkboxItems = [
      {
        value: '__allVaccines',
        text: 'Select all vaccines',
        checked: allVaccinesSelected
      },
      {
        divider: 'or'
      },
      ...allVaccines.map(vaccine => ({
        value: vaccine.name,
        text: vaccine.name.charAt(0).toUpperCase() + vaccine.name.slice(1),
        checked: selectedVaccines.includes(vaccine.name),
        conditional: {
          html: `
            <div class="nhsuk-form-group nhsuk-u-margin-bottom-0">
              <fieldset class="nhsuk-fieldset" aria-describedby="${vaccine.name}-products-hint">
                <legend class="nhsuk-fieldset__legend nhsuk-fieldset__legend--s">Vaccine products</legend>
                <div class="nhsuk-hint" id="${vaccine.name}-products-hint">Choose one or more products for ${vaccine.name}.</div>
                ${vaccine.products.map(product => {
                  const productValue = `${vaccine.name}${productValueDelimiter}${product.name}`
                  return `
                    <div class="nhsuk-checkboxes__item">
                      <input
                        class="nhsuk-checkboxes__input"
                        id="product-${productValue.replace(/[^a-zA-Z0-9]/g, '-') }"
                        name="vaccineProducts"
                        type="checkbox"
                        value="${productValue}"
                        ${selectedVaccineProducts.includes(productValue) ? 'checked' : ''}
                      >
                      <label class="nhsuk-label nhsuk-checkboxes__label" for="product-${productValue.replace(/[^a-zA-Z0-9]/g, '-') }">${product.name}</label>
                    </div>
                  `
                }).join('')}
              </fieldset>
            </div>
          `
        }
      }))
    ]
    res.render('prototype-setup/custom-config-vaccines', { checkboxItems, customConfig })
  })

  router.post('/prototype-setup/custom-config/vaccines', (req, res) => {
    const selectedVaccines = (req.body.vaccines
      ? (Array.isArray(req.body.vaccines) ? req.body.vaccines : [req.body.vaccines])
      : [])
      .filter(value => value && value !== '_unchecked')

    const explicitVaccineSelections = selectedVaccines.filter(value => value !== '__allVaccines')
    const allVaccines = (req.session.data.vaccines || []).map(vaccine => vaccine.name)
    const enabledVaccines = selectedVaccines.includes('__allVaccines') && explicitVaccineSelections.length === 0
      ? allVaccines
      : explicitVaccineSelections

    const selectedVaccineProducts = (req.body.vaccineProducts
      ? (Array.isArray(req.body.vaccineProducts) ? req.body.vaccineProducts : [req.body.vaccineProducts])
      : [])
      .filter(value => value && value !== '_unchecked' && value.includes('__product__'))

    const filteredVaccineProducts = selectedVaccines.includes('__allVaccines') && explicitVaccineSelections.length === 0
      ? []
      : selectedVaccineProducts.filter(productValue =>
          enabledVaccines.some(vaccineName => productValue.startsWith(`${vaccineName}__product__`))
        )

    req.session.data.customConfig = {
      ...(req.session.data.customConfig || {}),
      vaccines: enabledVaccines,
      vaccineProducts: filteredVaccineProducts
    }
    res.redirect('/prototype-setup/custom-config/batches')
  })

  // ----------------------------------------------------------------
  // Custom configuration — Step 3: Batches per vaccine product
  // ----------------------------------------------------------------

  router.get('/prototype-setup/custom-config/batches', (req, res) => {
    res.render('prototype-setup/custom-config-batches', {
      customConfig: req.session.data.customConfig || {}
    })
  })

  router.post('/prototype-setup/custom-config/batches', (req, res) => {
    req.session.data.customConfig = {
      ...(req.session.data.customConfig || {}),
      batchesPerProduct: req.body.batchesPerProduct
    }
    res.redirect('/prototype-setup/custom-config/data')
  })

  // ----------------------------------------------------------------
  // Custom configuration — Step 4: Data volume
  // ----------------------------------------------------------------

  router.get('/prototype-setup/custom-config/data', (req, res) => {
    res.render('prototype-setup/custom-config-data', {
      customConfig: req.session.data.customConfig || {}
    })
  })

  router.post('/prototype-setup/custom-config/data', (req, res) => {
    req.session.data.customConfig = {
      ...(req.session.data.customConfig || {}),
      additionalUsers: req.body.additionalUsers,
      vaccinations: req.body.vaccinations
    }
    res.redirect('/prototype-setup/custom-config/check')
  })

  // ----------------------------------------------------------------
  // Custom configuration — Check your answers
  // ----------------------------------------------------------------

  router.get('/prototype-setup/custom-config/check', (req, res) => {
    const customConfig = req.session.data.customConfig || {}
    const selectedUser = SIGN_IN_USERS.find(u => u.id === customConfig.userId) || null
    const selectedProductsByVaccine = getSelectedProductsByVaccine(customConfig.vaccineProducts || [])
    const selectedVaccines = (customConfig.vaccines || []).filter(vaccineName => vaccineName && vaccineName !== '_unchecked' && vaccineName !== '__allVaccines')
    const vaccineProductSelections = selectedVaccines.map(vaccineName => ({
      vaccineName,
      productNames: selectedProductsByVaccine[vaccineName] || []
    }))

    res.render('prototype-setup/custom-config-check', {
      customConfig,
      selectedUser,
      vaccineProductSelections
    })
  })

  // ----------------------------------------------------------------
  // Custom configuration — Apply
  // ----------------------------------------------------------------

  router.post('/prototype-setup/custom-config/apply', (req, res) => {
    const customConfig = req.session.data.customConfig || {}
    resetSession(req)
    const data = req.session.data

    const selectedUser = SIGN_IN_USERS.find(user => user.id === customConfig.userId)
    ensureUserExistsForScenario(data, selectedUser)

    data.currentUserId = customConfig.userId
    data.currentOrganisationId = customConfig.organisationId

    const orgId = customConfig.organisationId
    const org = data.organisations.find(o => o.id === orgId)

    if (org && customConfig.appointmentsInterfaceEnabled === false) {
      org.appointmentsInterfaceEnabled = false
    }

    const enabledVaccines = customConfig.vaccines || []
    const batchesPerProduct = parseInt(customConfig.batchesPerProduct, 10)
    const selectedProductsByVaccine = getSelectedProductsByVaccine(customConfig.vaccineProducts || [])
    if (enabledVaccines.length > 0) {
      setupBatchesForOrgVaccines(
        data,
        orgId,
        enabledVaccines,
        Number.isNaN(batchesPerProduct) ? undefined : batchesPerProduct,
        selectedProductsByVaccine
      )
    }

    const userCount = parseInt(customConfig.additionalUsers, 10) || 0
    if (userCount > 0) {
      addRandomUsers(data, orgId, userCount)
    }

    const vaccinationCount = parseInt(customConfig.vaccinations, 10) || 0
    if (vaccinationCount > 0) {
      addRandomVaccinations(data, orgId, vaccinationCount)
    }

    delete data.customConfig
    res.redirect('/home')
  })

}
