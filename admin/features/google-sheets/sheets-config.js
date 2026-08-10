// admin/features/google-sheets/sheets-config.js

const getEnvVar = (key) => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
      return import.meta.env[key];
    }
  } catch (e) {
    // Fallback if import.meta is unsupported
  }
  return window[key] || window.ENV?.[key] || '';
};

export const SHEETS_CONFIG = {
  apiKey: getEnvVar('VITE_SHEETS_API_KEY'),
  masterSheetId: getEnvVar('VITE_MASTER_SHEET_ID'),
  defaultRange: 'Sheet1!A2:B50',
  endpoints: {
    base: 'https://sheets.googleapis.com/v4/spreadsheets'
  }
};
