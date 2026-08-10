// admin/features/google-sheets/components/sheet-directory.js

export function renderDirectoryCards(container, masterDataList, onSelectSheet, onDeleteSheet) {
  if (!masterDataList || masterDataList.length === 0) {
    container.innerHTML = '<p>Master Sheet mein koi entry nahi mili.</p>';
    return;
  }

  container.innerHTML = masterDataList.map((item, index) => {
    // Direct Google Sheet Editor URL
    const googleSheetUrl = `https://docs.google.com/spreadsheets/d/${item.sheetId}/edit`;

    return `
      <div class="sheet-card" data-id="${item.sheetId}" data-name="${item.sheetName}">
        <div class="card-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <div class="card-title">📊 ${item.sheetName}</div>
          <button class="btn-delete" data-row="${index + 2}" title="Delete Sheet Link" style="background: none; border: none; cursor: pointer; font-size: 16px;">🗑️</button>
        </div>
        
        <small style="color: #6b7280; display: block; margin-bottom: 8px;">ID: ${item.sheetId.substring(0, 8)}...</small>
        <span class="card-badge">${item.totalRows} Items Active</span>

        <div style="margin-top: 12px;">
          <a href="${googleSheetUrl}" target="_blank" class="direct-link-btn" onclick="event.stopPropagation();" style="font-size: 12px; color: #2563eb; text-decoration: none; font-weight: bold;">
            Open in Sheets ↗
          </a>
        </div>
      </div>
    `;
  }).join('');

  // 1. Card Tap / Select Event Listener
  container.querySelectorAll('.sheet-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id');
      const name = card.getAttribute('data-name');
      onSelectSheet(id, name);
    });
  });

  // 2. Delete Button Event Listener
  container.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation(); // Card click event ko stop karta hai
      const rowIndex = btn.getAttribute('data-row');
      if (confirm('Kya aap is Sheet ID ko Master Sheet se remove karna chahte hain?')) {
        onDeleteSheet(rowIndex);
      }
    });
  });
}
