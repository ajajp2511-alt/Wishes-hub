// admin/features/google-sheets/sheets-assembly.js
import { getMasterSheetValues, appendSheetIdToMaster } from './sheets-core.js';

// Master Sheet ki sabhi Google Sheet IDs get karna
export async function loadGoogleSheetsAdminData() {
  const rawRows = await getMasterSheetValues();

  return rawRows.map((row, index) => ({
    id: index + 1,
    sheetName: row[0] || 'Untitled Sheet',
    sheetId: row[1] || ''
  }));
}

// Admin Panel se nayi Google Sheet ki ID save karne wala action
export async function addNewSheetId(sheetName, sheetId, accessToken) {
  if (!sheetName || !sheetId) {
    throw new Error('Sheet Name aur Sheet ID dono zaruri hain.');
  }

  return await appendSheetIdToMaster(sheetName, sheetId, accessToken);
}
