/**
 * Worker Analytics Configuration
 * Path: admin/features/worker-analytics/worker-config.js
 */

export const WORKER_CONFIG = {
  version: '1.0.0',
  edgeProvider: 'Cloudflare Workers / Vercel Edge',
  maxCpuMsLimit: 50,
  maxMemoryMbLimit: 128,
  logRetentionDays: 30
};
