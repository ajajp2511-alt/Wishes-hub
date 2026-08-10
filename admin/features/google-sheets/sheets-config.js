// admin/features/google-sheets/sheets-config.js

// Safe helper to extract env variables without VITE_ prefix
const getEnvVar = (key) => {
  try {
    // 1. Check process.env (Standard/Node/Vercel Serverless environment)
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key];
    }
    // 2. Check import.meta.env (Vite environment without prefix)
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
      return import.meta.env[key];
    }
  } catch (e) {
    // Fallback if environment access fails
  }
  // 3. Check Global Window object
  return window[key] || window.ENV?.[key] || '';
};

export const SHEETS_CONFIG = {
  // Without VITE_ prefix
  apiKey: getEnvVar('SHEETS_API_KEY') || getEnvVar('GOOGLE_API_KEY'),
  masterSheetId: getEnvVar('MASTER_SHEET_ID'),
  
  defaultRange: 'Sheet1!A2:B50',
  endpoints: {
    base: 'https://sheets.googleapis.com/v4/spreadsheets'
  }
};
