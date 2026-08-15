/**
 * Reports & Export Configuration
 * Path: admin/features/reports/reports-config.js
 */

export const REPORTS_CONFIG = {
  version: '1.0.0',
  exportFormats: ['CSV', 'XLSX', 'PDF', 'JSON'],
  cloudStorage: {
    driveEnabled: true,
    s3Enabled: false
  },
  autoArchiveDays: 90
};
