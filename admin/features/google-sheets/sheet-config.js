/**
 * Google Sheets Configuration
 * Path: admin/features/google-sheets/sheets-config.js
 */

export const SHEETS_CONFIG = {
  version: '1.0.0',
  syncIntervalMs: 300000, // 5 minutes
  maxBatchImportRows: 5000,
  conflictStrategy: 'DATABASE_WINS',
  autoTrimSpaces: true
};
