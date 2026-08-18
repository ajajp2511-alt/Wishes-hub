/**
 * Health & System Monitor Core Engine
 * Path: admin/features/health-monitor/health-core.js
 */

import { HEALTH_CONFIG } from './health-config.js';

export class HealthCore {
  constructor() {
    this.serverStatus = {
      uptime: '99.98%',
      activeRegions: ['sin1 (Singapore)', 'bom1 (Mumbai)'],
      avgResponseTime: '42ms'
    };

    this.dbStatus = {
      connectionsActive: 24,
      connectionsMax: 100,
      queryLatency: '18ms',
      status: 'Healthy'
    };

    this.activeAlerts = [
      { id: 'ALT-301', type: 'Warning', target: 'Third-Party Payment API', message: 'Razorpay latency spike > 300ms', time: '2026-08-18 22:30:10' }
    ];
  }

  getServerStatus() { return this.serverStatus; }
  getDbStatus() { return this.dbStatus; }
  getActiveAlerts() { return this.activeAlerts; }
}

export const healthCoreInstance = new HealthCore();
