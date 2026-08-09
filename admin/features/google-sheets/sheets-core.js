import { SHEETS_CONFIG } from './sheets-config.js';

// Raw API Calls & Data Fetching
export async function getMasterSheetValues() {
  const { apiKey, masterSheetId, defaultRange, endpoints } = SHEETS_CONFIG;
  const url = `${endpoints.base}/${masterSheetId}/values/${defaultRange}?key=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    const data = await response.json();
    return data.values || [];
  } catch (error) {
    console.error('Master Sheet Fetch Error:', error);
    return [];
  }
}

export async function getSubSheetValues(sheetId, range = 'Sheet1!A1:E100') {
  const { apiKey, endpoints } = SHEETS_CONFIG;
  const url = `${endpoints.base}/${sheetId}/values/${range}?key=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    const data = await response.json();
    return data.values || [];
  } catch (error) {
    console.error('Sub Sheet Fetch Error:', error);
    return [];
  }
}
