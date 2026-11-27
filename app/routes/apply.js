const sortByNameThenPostcode = (getPostcode = (item) => item.postcode) => (a, b) => {
  if (a.name < b.name) return -1
  if (a.name > b.name) return 1
  const postcodeA = getPostcode(a)
  const postcodeB = getPostcode(b)
  if (postcodeA < postcodeB) return -1
  return 1
}

const findOrganisationById = (data, organisationId) => {
  if (!organisationId) return null
  return (data.organisations || []).find((organisation) => organisation.id === organisationId) ||
    (data.allOrganisations || []).find((organisation) => organisation.id === organisationId)
}

module.exports = router => {

  router.get('/apply/start', (req, res) => {
    const data = req.session.data
    let errors = []

    if (req.query.error === 'no-organisation') {
      errors.push({
        code: 'required',
        href: '#organisation-code'
      })
    } else if (req.query.error === 'existing-account') {
      errors.push({
        code: 'existing-account',
        href: '#organisation-code'
      })
    }

    const pharmacies = data.allOrganisations.sort(sortByNameThenPostcode()).filter((organisation) => organisation.type === "Community pharmacy" || organisation.type === "GP practice")

    res.render('apply/start', {
      pharmacies,
      errors
    })
  })

  router.post('/apply/start-answer', (req, res) => {
    const data = req.session.data

    if (data.oneOrMany === "single") {
      res.redirect('/apply/find-single-pharmacy')
    } else if (data.oneOrMany === "chain") {
      res.redirect('/apply/group-of-pharmacies')
    } else {
      res.redirect('/apply/start')
    }
  })

  router.post('/apply/answer-organisation', (req, res) => {
    const data = req.session.data

    const organisationId = data.organisationCode || data.organisationId
    data.organisationId = organisationId
    const organisation = findOrganisationById(data, organisationId)

    if (!organisation) {
      res.redirect('/apply/start?error=no-organisation');
    } else if (organisation.id === "FA424") {
      res.redirect('/apply/start?error=existing-account');
    } else {
      res.redirect('/apply/check-organisation')
    }

  })

  // Show vaccine types page
  router.get('/apply/vaccine-types', (req, res) => {
    const errors = []

    if (req.query.error === 'required') {
      errors.push({
        code: 'required',
        href: '#vaccine-types'
      })
    }

    res.render('apply/vaccine-types', {
      errors
    })
  })

  // Check submitted vaccine types
  router.post('/apply/answer-vaccine-types', (req, res) => {
    const data = req.session.data

    if (!data.vaccineTypes?.length) {
      delete data.vaccineTypes
      res.redirect('/apply/vaccine-types?error=required')
    } else {
      res.redirect('/apply/contact-details')
    }
  })

  // Show contact details page
  router.get('/apply/contact-details', (req, res) => {
    const fieldIds = {
      'first-name': '#first-name',
      'last-name': '#last-name',
      email: '#email'
    }
    const errorFields = (req.query.error || '').toString().split(',')
    const errors = errorFields
      .filter(field => fieldIds[field])
      .map(field => ({
        code: 'required',
        href: fieldIds[field]
      }))

    res.render('apply/contact-details', {
      errors
    })
  })

  // Check contact details
  router.post('/apply/check', (req, res) => {
    const data = req.session.data
    const errors = []

    if (typeof data.firstName !== 'string' || !data.firstName.trim()) {
      errors.push('first-name')
    }
    if (typeof data.lastName !== 'string' || !data.lastName.trim()) {
      errors.push('last-name')
    }
    if (typeof data.email !== 'string' || !data.email.trim()) {
      errors.push('email')
    }

    if (errors.length) {
      res.redirect(`/apply/contact-details?error=${errors.join(',')}`)
    } else {
      res.redirect('/apply/check')
    }
  })

  // Show organisation check page
  router.get('/apply/check-organisation', (req, res) => {
    const data = req.session.data
    const organisationId = data.organisationId
    const organisation = findOrganisationById(data, organisationId)
    if (!organisation) { res.redirect('/apply/start'); return }

    res.render('apply/check-organisation', {
      organisation
    })
  })

  // Check your answers page
  router.get('/apply/check', (req, res) => {
    const data = req.session.data
    const organisationId = data.organisationId
    const organisation = findOrganisationById(data, organisationId)
    if (!organisation) { res.redirect('/apply/start'); return }

    res.render('apply/check', {
      organisation
    })
  })

  // Check your email page
  router.get('/apply/check-your-email', (req, res) => {
    const data = req.session.data
    const organisationId = data.organisationId
    const organisation = findOrganisationById(data, organisationId)

    if (!organisation) { res.redirect('/apply/start'); return }

    res.render('apply/check-your-email', {
      organisation
    })
  })

  // Routing after the final check answers page
  router.post('/apply/answer-check', (req, res) => {

    res.redirect('/apply/confirmation')
  })

  // Welcome email mockup
  router.get('/apply/welcome-email', (req, res) => {
    const data = req.session.data
    const organisationId = data.organisationId
    const organisation = findOrganisationById(data, organisationId)
    if (!organisation) { res.redirect('/apply/start'); return }

    res.render('apply/welcome-email', {
      organisation
    })
  })

}
