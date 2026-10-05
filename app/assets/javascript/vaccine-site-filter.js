// Filter vaccine site sections from the site select menu

document.addEventListener('DOMContentLoaded', () => {
  const select = document.getElementById('select-1')
  const siteSections = document.querySelectorAll('[data-vaccine-site]')

  if (!select || siteSections.length === 0) return

  select.addEventListener('change', () => {
    const selectedSite = select.value

    siteSections.forEach((siteSection) => {
      siteSection.hidden = selectedSite !== '' && siteSection.dataset.vaccineSite !== selectedSite
    })
  })
})
