/**
 * Analytics to System Logs Connection
 * Path: admin/features/analytics/connection/system-logs-conn.js
 * Logs traffic anomalies, viral threshold breaches, and ad monetization events to audit logs.
 */

import { logsCoreInstance } from '../../system-logs/logs-core.js';

export const AnalyticsLogsConn = {
    async logAnalyticsEvent(eventType, identifier, details = {}) {
        try {
            const logEntry = {
                timestamp: new Date().toISOString(),
                module: 'analytics',
                eventType: eventType || 'ANALYTICS_METRIC_ALERT',
                identifier: identifier || 'ANALYTIC_STUDIO',
                severity: details.severity || 'LOW',
                metadata: details
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
            console.error('Failed to log analytics event:', error);
            return { success: false, error: error.message };
        }
    }
};
