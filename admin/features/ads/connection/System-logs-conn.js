/**
 * Ads to System Logs Connection
 * Path: admin/features/ads/connection/system-logs-conn.js
 * Logs ad creation requests, billing events, fraud guard triggers, and approval status updates to audit logs.
 */

import { logsCoreInstance } from '../../system-logs/logs-core.js';

export const AdsLogsConn = {
    async logAdEvent(eventType, adId, details = {}) {
        try {
            const logEntry = {
                timestamp: new Date().toISOString(),
                module: 'ads',
                eventType: eventType || 'AD_MANAGEMENT_ACTION',
                identifier: adId || 'AD_SLOT',
                severity: details.severity || 'MEDIUM',
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
            console.error('Failed to log ad event:', error);
            return { success: false, error: error.message };
        }
    }
};
