/**
 * Health & System Monitor Configuration
 * Path: admin/features/health-monitor/health-config.js
 */

export const HEALTH_CONFIG = {
  version: '1.0.0',
  pingIntervalMs: 60000, // 1 minute
  alertChannels: ['Telegram', 'Slack', 'Email'],
  dbLatencyThresholdMs: 250,
  memoryWarningThresholdPct: 85
};
