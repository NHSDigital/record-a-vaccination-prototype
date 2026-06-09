module.exports = (router) => {
  router.get('/explorations', (req, res) => {
    const explorationLinks = [
      {
        href: '/explorations/record-vaccinations-v2',
        title: 'Record vaccinations v2',
        description: 'Pilot area for trying alternative record vaccination journey ideas without affecting the current flow.'
      }
    ]

    res.render('explorations/index', { explorationLinks })
  })

  router.get('/explorations/record-vaccinations-v2', (req, res) => {
    res.render('explorations/record-vaccinations-v2')
  })
}
