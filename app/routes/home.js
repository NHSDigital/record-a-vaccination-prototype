module.exports = router => {

  // Dashboard
  router.get('/home', (req, res) => {

    const dateToday = new Date()

    const stats = []

    let vaccines = ["RSV", "Pertussis"]

    if (Math.random() > 0.5) { vaccines.push("Flu") }
    if (Math.random() > 0.5) { vaccines.push("Covid") }

    for (vaccine of vaccines) {

      let vaccineStat = {
        vaccine: vaccine,
        days: []
      }

      for (let i = 0; i < 8; i++) {

        let day = new Date(dateToday)
        day.setDate(day.getDate() - i)

        let count = Math.round(Math.random() * 20) + 1
        if (i > 0) {
          count += Math.round(Math.random() * 150)
        }

        vaccineStat.days.push({
          date: day.toISOString().substring(0,10),
          count: count
        })
      }

      stats.push(vaccineStat)
    }

    res.render('home/index', {
      stats
    })
  })
}
