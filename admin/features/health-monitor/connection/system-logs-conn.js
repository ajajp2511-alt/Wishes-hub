/**
 * Health-Monitor to System Logs Connection
 * Path: admin/features/health-monitor/connection/system-logs-conn.js
 * Logs server outages, database degradation, and error spikes to the system audit trail.
 */

import { logsCoreInstance } from '../../system-logs/logs-core.js';

export const HealthMonitorLogsConn = {
    async logHealthEvent(eventData) {
        try {
            const logEntry = {
                timestamp: new Date().toISOString(),
                module: 'health-monitor',
                eventType: eventData.type || 'SYSTEM_HEALTH_ALERT',
                identifier: eventData.target || 'SERVER_INFRA',
                severity: eventData.severity || 'HIGH',
                metadata: eventData
            };

            if (logsCoreInstance && typeof logsCoreInstance.recordLog === 'function') {
                await logsCoreInstance.recordLog(logEntry);
            } else {
                const logs = JSON.parse(localStorage.getItem('wishes_hub_audit_logs') || '[]');
                logs.unshift(logEntry);
                localStorage.setItem('wishes_hub_audit_logs', JSON.stringify(logs.slice(0, 500)));
            }

            return { success: true };
        } catch (error) {
            console.error('Failed to log health event:', error);
            return { success: false, error: error.message };
        }
    }
};
