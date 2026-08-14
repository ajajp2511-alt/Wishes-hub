/**
 * Localization & Languages Configuration
 * Path: admin/features/localization/loc-config.js
 */

export const LOC_CONFIG = {
  version: '1.0.0',
  defaultLocale: 'hi',
  fallbackLocale: 'en',
  locales: [
    { code: 'hi', name: 'Hindi (हिंदी)', region: 'North/Central India', active: true, font: 'Noto Sans Devanagari' },
    { code: 'en', name: 'English', region: 'Global', active: true, font: 'Inter' },
    { code: 'mr', name: 'Marathi (मराठी)', region: 'Maharashtra', active: true, font: 'Mukta' },
    { code: 'gu', name: 'Gujarati (ગુજરાતી)', region: 'Gujarat', active: true, font: 'Anek Gujarati' },
    { code: 'ta', name: 'Tamil (தமிழ்)', region: 'Tamil Nadu', active: true, font: 'Catamaran' },
    { code: 'te', name: 'Telugu (తెలుగు)', region: 'Andhra/Telangana', active: false, font: 'Hind Guntur' }
  ]
};
