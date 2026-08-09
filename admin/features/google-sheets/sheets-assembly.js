import { getMasterSheetValues, getSubSheetValues } from './sheets-core.js';

// Data formatting and UI payload assembly
export async function loadGoogleSheetsAdminData() {
  const rawRows = await getMasterSheetValues();

  return rawRows.map((row, index) => ({
    id: index + 1,
    category: row[0] || 'Untitled',
    sheetId: row[1] || '',
    status: row[2] || 'Inactive'
  }));
}

export async function loadCategoryData(sheetId) {
  if (!sheetId) return [];
  return await getSubSheetValues(sheetId);
}
