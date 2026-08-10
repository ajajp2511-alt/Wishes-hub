// admin/features/google-sheets/sheets-config.js

export const SHEETS_CONFIG = {
  // Safe environment reading using Optional Chaining
  apiKey: import.meta?.env?.VITE_SHEETS_API_KEY || '',
  masterSheetId: import.meta?.env?.VITE_MASTER_SHEET_ID || '',
  
  defaultRange: 'Sheet1!A2:B50',
  endpoints: {
    base: 'https://sheets.googleapis.com/v4/spreadsheets'
  }
};
