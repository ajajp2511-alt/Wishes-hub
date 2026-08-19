/**
 * Google Sheets Core Engine
 * Path: admin/features/google-sheets/sheets-core.js
 */

import { SHEETS_CONFIG } from './sheets-config.js';

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
