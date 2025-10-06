module.exports = router => {
 

router.post('/lists/date-answer', (req, res) => {

	const date = req.session.data.date
  
	if (date === 'no-date') {
  
	  res.redirect('/lists/name')
  
	} else  {
  
	  res.redirect('/lists/add-nhs-numbers')
  
	} 
  })

}