/**
 * User-Permissions to System Logs Connection
 * Logs role changes, permission overrides, and security access modifications to the audit trail.
 */

import { logsCoreInstance } from '../../system-logs/logs-core.js';

export const UserPermissionsLogsConn = {
    async logPermissionChange(adminIdentifier, actionType, details = {}) {
        try {
            const logEntry = {
                timestamp: new Date().toISOString(),
                module: 'user-permissions',
                eventType: actionType, // e.g., 'ROLE_UPDATED', 'PERMISSION_REVOKED'
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
            console.error('Failed to log permission change:', error);
            return { success: false, error: error.message };
        }
    }
};
