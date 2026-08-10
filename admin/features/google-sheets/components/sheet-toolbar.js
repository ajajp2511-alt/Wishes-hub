// Search Bar, Dropdown Switcher, aur Sync Button ka logic
export function setupToolbarControls({
  dropdown,
  searchInput,
  masterDataList,
  onSheetSelect,
  onSearch
}) {
  // Populate Dropdown Options
  dropdown.style.display = 'inline-block';
  dropdown.innerHTML = '<option value="">-- Select Sheet --</option>' + 
    masterDataList.map(item => `<option value="${item.sheetId}">${item.sheetName}</option>`).join('');

  // Dropdown Change Event
  dropdown.onchange = (e) => {
    const selectedId = e.target.value;
    const selectedItem = masterDataList.find(item => item.sheetId === selectedId);
    if (selectedItem) {
      onSheetSelect(selectedItem.sheetId, selectedItem.sheetName);
    }
  };

  // Search Input Event
  searchInput.oninput = (e) => {
    const query = e.target.value.toLowerCase();
    onSearch(query);
  };
}
