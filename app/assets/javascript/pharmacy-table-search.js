// Simple client-side search for the pharmacies table

document.addEventListener('DOMContentLoaded', function () {
  const searchInputs = [
    document.getElementById('pharmacy-search'),
    document.getElementById('pharmacy-search-design-system')
  ].filter(Boolean);

  if (searchInputs.length === 0) return;

  const table = document.getElementById('pharmacies-table-data');
  if (!table) return;
  const rows = table.querySelectorAll('tbody tr');
  const resultsCaption = document.getElementById('pharmacies-results-caption');
  const totalRows = rows.length;
  const totalOrganisations = Number(resultsCaption?.dataset.totalOrganisations || totalRows);
  const resultsStart = Number(resultsCaption?.dataset.resultsStart || (totalRows > 0 ? 1 : 0));
  const resultsEnd = Number(resultsCaption?.dataset.resultsEnd || totalRows);

  const updateResultsCaption = function (query) {
    if (!resultsCaption) return;

    const visibleRows = Array.from(rows).filter(row => row.style.display !== 'none').length;
    const hasQuery = Boolean(query && query.trim());

    if (hasQuery) {
      const end = visibleRows > 0 ? visibleRows : 0;
      resultsCaption.textContent = `Showing ${visibleRows > 0 ? 1 : 0} - ${end} of ${totalOrganisations} pharmacies`;
      return;
    }

    resultsCaption.textContent = `Showing ${resultsStart} - ${resultsEnd} of ${totalOrganisations} pharmacies`;
  };

  const filterRows = function (query) {
    rows.forEach(row => {
      const nameCell = row.querySelector('td');
      if (!nameCell) return;
      const name = nameCell.textContent.toLowerCase();
      row.style.display = name.includes(query) ? '' : 'none';
    });

    updateResultsCaption(query);
  };

  searchInputs.forEach(input => {
    input.addEventListener('input', function () {
      const query = this.value.toLowerCase();

      searchInputs.forEach(otherInput => {
        if (otherInput !== this) {
          otherInput.value = this.value;
        }
      });

      filterRows(query);
    });
  });

  const initialValue = searchInputs.find(input => input.value && input.value.trim())?.value || '';
  if (initialValue) {
    searchInputs.forEach(input => {
      input.value = initialValue;
    });
    filterRows(initialValue.toLowerCase());
    return;
  }

  updateResultsCaption('');
});
