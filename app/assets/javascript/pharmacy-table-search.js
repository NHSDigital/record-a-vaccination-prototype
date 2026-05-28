// Simple client-side search for the pharmacies table

document.addEventListener('DOMContentLoaded', function () {
  const searchInput = document.getElementById('pharmacy-search');
  if (!searchInput) return;
  const table = document.getElementById('pharmacies-table-data');
  if (!table) return;
  const rows = table.querySelectorAll('tbody tr');

  searchInput.addEventListener('input', function () {
    const query = this.value.toLowerCase();
    rows.forEach(row => {
      const nameCell = row.querySelector('td');
      if (!nameCell) return;
      const name = nameCell.textContent.toLowerCase();
      row.style.display = name.includes(query) ? '' : 'none';
    });
  });
});
