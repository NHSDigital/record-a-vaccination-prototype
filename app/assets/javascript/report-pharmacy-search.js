// Search/filter for the reporting choose-pharmacies page

document.addEventListener('DOMContentLoaded', function () {
  const searchInput = document.getElementById('report-pharmacy-search');
  if (!searchInput) return;
  const list = document.getElementById('pharmacy-checkbox-list');
  if (!list) return;
  const items = Array.from(list.querySelectorAll('.nhsuk-checkboxes__item'));
  // Exclude the first (all), divider, and search field
  const filterable = items.slice(2);

  searchInput.addEventListener('input', function () {
    const query = this.value.toLowerCase();
    filterable.forEach(item => {
      const label = item.textContent.toLowerCase();
      item.style.display = label.includes(query) ? '' : 'none';
    });
  });
});
