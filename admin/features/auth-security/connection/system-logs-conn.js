/**
 * Auth-Security to System Logs Connection
 * Path: admin/features/auth-security/connection/system-logs-conn.js
 * Bridges auth anomalies, RBAC changes, and security events with system audit logs.
 */

import { logsCoreInstance } from '../../system-logs/logs-core.js';

export const AuthSecurityLogsConn = {
    async logSecurityEvent(eventType, identifier, details = {}) {
        try {
            const logEntry = {
                timestamp: new Date().toISOString(),
                module: 'auth-security',
                eventType: eventType, // e.g., 'RBAC_ROLE_CHANGE', 'API_KEY_GENERATED', 'BRUTE_FORCE_TRIGGERED'
                identifier: identifier || 'SYSTEM_AUTH',
                severity: details.severity || 'HIGH',
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
            console.error('Failed to log auth security event:', error);
            return { success: false, error: error.message };
        }
    }
};
