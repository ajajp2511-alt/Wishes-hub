// admin/features/google-sheets/sheets-config.js

export const SHEETS_CONFIG = {
  // Direct internal API endpoint (Keys backend par secure rahengi)
  endpoint: '/api/sheets'
};

// Data fetch karne ke liye function:
export async function fetchSheetData(range = 'Sheet1!A2:B50') {
  const res = await fetch(`${SHEETS_CONFIG.endpoint}?range=${range}`);
  return await res.json();
}
