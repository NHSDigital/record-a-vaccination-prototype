module.exports = router => {


  router.get('/lists', (req, res) => {

    const currentOrganisation = res.locals.currentOrganisation;
    const lists = currentOrganisation.lists || []

    res.render('lists/index', {
      lists
    })

  })

  router.post('/lists/add-numbers', (req, res) => {

    const currentOrganisation = res.locals.currentOrganisation;
    currentOrganisation.lists ||= []

    // This bit isn’t working yet so faked for now.
    currentOrganisation.lists.push({
      siteCode: "TODO"
    })

    res.redirect('/lists/list')

  })

}
