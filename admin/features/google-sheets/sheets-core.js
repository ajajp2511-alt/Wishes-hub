/**
 * Google Sheets Core Engine & API Services
 * Path: admin/features/google-sheets/sheets-core.js
 */

import { SHEETS_CONFIG } from './sheets-config.js';

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

// 5. SheetsCore Class for Metrics, Schema Mappings & Metadata
export class SheetsCore {
  constructor() {
    this.connectedSheets = [
      { id: 'SHEET-01', name: 'Master Wish Registrations 2026', rows: 1420, lastSynced: '2026-08-19 12:30:15', status: 'Connected' },
      { id: 'SHEET-02', name: 'Festive Feedback Submissions', rows: 380, lastSynced: '2026-08-19 12:25:00', status: 'Connected' }
    ];

    this.syncMetrics = {
      totalRowsSynced: 1800,
      failedRows: 0,
      syncLatency: '1.2s'
    };

    this.schemaMappings = [
      { column: 'A', sheetHeader: 'User Name', dbField: 'user_full_name' },
      { column: 'B', sheetHeader: 'Greeting Message', dbField: 'wish_text' },
      { column: 'C', sheetHeader: 'Submission Time', dbField: 'created_at' }
    ];
  }

  getConnectedSheets() { return this.connectedSheets; }
  getSyncMetrics() { return this.syncMetrics; }
  getSchemaMappings() { return this.schemaMappings; }
}

export const sheetsCoreInstance = new SheetsCore();
