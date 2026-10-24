/**
 * 3D Engine to System Logs Connection
 * Path: admin/features/3d/connection/system-logs-conn.js
 * Logs 3D asset optimization events, generation failures, and assembly logs to the audit trail.
 */

import { logsCoreInstance } from '../../system-logs/logs-core.js';

export const Master3DLogsConn = {
    async log3DEvent(eventType, identifier, details = {}) {
        try {
            const logEntry = {
                timestamp: new Date().toISOString(),
                module: '3d',
                eventType: eventType || '3D_ENGINE_EVENT',
                identifier: identifier || 'MASTER_3D_ASSEMBLY',
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
            console.error('Failed to log 3D engine event:', error);
            return { success: false, error: error.message };
        }
    }
};
