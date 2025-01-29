module.exports = router => {

 router.post('/find-a-record/answer-search', (req, res) => {
  const data = req.session.data

  if (data.nhsNumberKnown === "yes") {
    return res.redirect('/find-a-record/patient-history')
  } else if (data.nhsNumberKnown === "no") {
    res.redirect('/find-a-record/patient-search')
  } else {
    res.redirect('/find-a-record')
  }

})

}
