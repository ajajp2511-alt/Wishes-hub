/**
 * Manage-Home to System Logs Connection
 * Path: admin/features/manage-home/connection/system-logs-conn.js
 * Logs dashboard actions, announcement updates, and stats refreshes to the audit trail.
 */

import { logsCoreInstance } from '../../system-logs/logs-core.js';

export const ManageHomeLogsConn = {
    async logHomeActivity(eventType, identifier, details = {}) {
        try {
            const logEntry = {
                timestamp: new Date().toISOString(),
                module: 'manage-home',
                eventType: eventType || 'DASHBOARD_ACTION',
                identifier: identifier || 'HOME_DASHBOARD',
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
            console.error('Failed to log home activity event:', error);
            return { success: false, error: error.message };
        }
    }
};
