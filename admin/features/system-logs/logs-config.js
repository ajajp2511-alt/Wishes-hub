/**
 * System Logs Configuration
 * Path: admin/features/system-logs/logs-config.js
 */

export const LOGS_CONFIG = {
  version: '1.0.0',
  logRetentionDays: 90,
  autoBackupSchedule: '0 0 * * *', // Daily midnight
  maxCrashStackLines: 50,
  redactPiiFields: ['password', 'token', 'cvv', 'secret']
};
