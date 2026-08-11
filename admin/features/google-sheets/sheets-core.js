// admin/features/google-sheets/sheets-core.js
import { SHEETS_CONFIG } from '/admin/features/google-sheets/sheets-config.js';

// Helper function for API errors
async function parseApiError(response) {
  try {
    const errorJson = await response.json();
    return errorJson?.error || errorJson?.message || response.statusText;
  } catch (e) {
    return response.statusText;
  }
}

// 1. Master Sheet Read Logic (via /api/sheets Proxy)
export async function getMasterSheetValues() {
  const { endpoint } = SHEETS_CONFIG;

  if (!endpoint) {
    console.error('Master Sheet Config Missing: Endpoint undefined');
    return [];
  }

  try {
    const response = await fetch(`${endpoint}?type=master`);
    if (!response.ok) {
      const errorDetails = await parseApiError(response);
      throw new Error(`HTTP Error: ${response.status} - ${errorDetails}`);
    }
    const data = await response.json();
    return data.values || [];
  } catch (error) {
    console.error('Master Sheet Read Error:', error);
    return [];
  }
}

// 2. Sub-Sheet Read Logic (via /api/sheets Proxy)
export async function getSubSheetValues(sheetId, range = 'Sheet1!A1:Z100') {
  const { endpoint } = SHEETS_CONFIG;
  if (!sheetId || !endpoint) return [];

  try {
    const url = `${endpoint}?sheetId=${encodeURIComponent(sheetId)}&range=${encodeURIComponent(range)}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorDetails = await parseApiError(response);
      throw new Error(`HTTP Error: ${response.status} - ${errorDetails}`);
    }
    const data = await response.json();
    return data.values || [];
  } catch (error) {
    console.error('Sub-Sheet Read Error:', error);
    return [];
  }
}

// 3. Append Sheet Entry (via /api/sheets Proxy)
export async function appendSheetIdToMaster(sheetName, sheetId, accessToken) {
  const { endpoint } = SHEETS_CONFIG;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({ action: 'append', sheetName, sheetId })
    });

    if (!response.ok) {
      const errorDetails = await parseApiError(response);
      throw new Error(`Failed to add sheet ID: ${errorDetails}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Master Sheet Write Error:', error);
    throw error;
  }
}

// 4. Clear/Delete Sheet Entry (via /api/sheets Proxy)
export async function deleteSheetIdFromMaster(rowIndex, accessToken) {
  const { endpoint } = SHEETS_CONFIG;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({ action: 'delete', rowIndex })
    });

    if (!response.ok) {
      const errorDetails = await parseApiError(response);
      throw new Error(`Failed to delete sheet ID: ${errorDetails}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Master Sheet Delete Error:', error);
    throw error;
  }
}
