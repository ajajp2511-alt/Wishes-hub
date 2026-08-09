// admin/features/google-sheets/sheets-core.js
import { SHEETS_CONFIG } from './sheets-config.js';

// Master Sheet se IDs aur Names read karne ka logic
export async function getMasterSheetValues() {
  const { apiKey, masterSheetId, defaultRange, endpoints } = SHEETS_CONFIG;
  const url = `${endpoints.base}/${masterSheetId}/values/${defaultRange}?key=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    const data = await response.json();
    return data.values || [];
  } catch (error) {
    console.error('Master Sheet Read Error:', error);
    return [];
  }
}

// Master Sheet mein Nayi Google Sheet Ki ID add karne ka logic
export async function appendSheetIdToMaster(sheetName, sheetId, accessToken) {
  const { masterSheetId, endpoints } = SHEETS_CONFIG;
  const url = `${endpoints.base}/${masterSheetId}/values/Sheet1!A:B:append?valueInputOption=USER_ENTERED`;

  const bodyData = {
    values: [
      [sheetName, sheetId]
    ]
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(bodyData)
    });

    if (!response.ok) {
      throw new Error(`Failed to add sheet ID: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Master Sheet Write Error:', error);
    throw error;
  }
}
