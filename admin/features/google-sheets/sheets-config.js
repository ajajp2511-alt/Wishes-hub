// Google Sheets API Configuration
export const SHEETS_CONFIG = {
  apiKey: import.meta.env.VITE_SHEETS_API_KEY,
  masterSheetId: import.meta.env.VITE_MASTER_SHEET_ID,
  defaultRange: 'Sheet1!A2:C50',
  endpoints: {
    base: 'https://sheets.googleapis.com/v1/spreadsheets'
  }
};
