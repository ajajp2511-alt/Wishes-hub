/**
 * Login to System Logs Connection
 * Records login attempts, session events, and failures to the audit logger.
 */

import { logsCoreInstance } from '../../system-logs/logs-core.js';

export const LoginSystemLogsConn = {
    async recordLoginEvent(eventType, identifier, details = {}) {
        try {
            const logEntry = {
                timestamp: new Date().toISOString(),
                module: 'login',
                eventType: eventType, // e.g., 'LOGIN_ATTEMPT', 'LOGIN_SUCCESS', 'SESSION_REVOKED'
                identifier: identifier,
                ip: details.ip || 'unknown',
                userAgent: navigator.userAgent,
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
            console.error('Failed to log login event:', error);
            return { success: false, error: error.message };
        }
    }
};
