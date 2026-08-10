// Master Cards UI Handle karne ka dedicated module
export function renderDirectoryCards(container, masterDataList, onSelectSheet) {
  if (!masterDataList || masterDataList.length === 0) {
    container.innerHTML = '<p>Master Sheet mein koi entry nahi mili.</p>';
    return;
  }

  container.innerHTML = masterDataList.map(item => `
    <div class="sheet-card" data-id="${item.sheetId}" data-name="${item.sheetName}">
      <div class="card-title">📊 ${item.sheetName}</div>
      <small>ID: ${item.sheetId.substring(0, 8)}...</small>
      <span class="card-badge">${item.totalRows} Items Active</span>
    </div>
  `).join('');

  // Event Listeners for Cards
  container.querySelectorAll('.sheet-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id');
      const name = card.getAttribute('data-name');
      onSelectSheet(id, name);
    });
  });
}
