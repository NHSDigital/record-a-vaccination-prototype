module.exports = (router) => {

  // Viewing a region's stats
  router.get('/support/regions/:code', (req, res) => {
    const { code } = req.params
    const region = req.session.data.regions.find((region) => region.code === code)

    res.render('support/region', {
      region
    })
  })

}
