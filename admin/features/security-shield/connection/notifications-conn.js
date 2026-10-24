/**
 * Notifications to System Logs Connection
 * Logs broadcast dispatches, delivery statuses, and notification failures to the audit trail.
 */

import { logsCoreInstance } from '../../system-logs/logs-core.js';

export const NotificationsLogsConn = {
    async logBroadcastEvent(adminIdentifier, broadcastType, details = {}) {
        try {
            const logEntry = {
                timestamp: new Date().toISOString(),
                module: 'notifications',
                eventType: broadcastType, // e.g., 'PUSH_BROADCAST_SENT', 'CAMPAIGN_SCHEDULED'
                identifier: adminIdentifier,
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
            console.error('Failed to log broadcast event:', error);
            return { success: false, error: error.message };
        }
    }
};
