/**
 * Sign-In to System Logs Connection
 * Reports authentication attempts, lockouts, and security events to the system logs hub.
 */

import { logsCoreInstance } from '../../system-logs/logs-core.js';

export const SignInSystemLogsConn = {
    async logAuthEvent(eventType, identifier, details = {}) {
        try {
            const logEntry = {
                timestamp: new Date().toISOString(),
                module: 'sign-in',
                eventType: eventType, // e.g., 'LOGIN_SUCCESS', 'LOGIN_FAILED', 'LOCKOUT_TRIGGERED'
                identifier: identifier,
                ip: details.ip || 'unknown',
                userAgent: navigator.userAgent,
                metadata: details
            };

            // Push to system logs core database / storage stream
            if (logsCoreInstance && typeof logsCoreInstance.recordLog === 'function') {
                await logsCoreInstance.recordLog(logEntry);
            } else {
                // Fallback local persistence for audit trail
                const existingLogs = JSON.parse(localStorage.getItem('wishes_hub_audit_logs') || '[]');
                existingLogs.unshift(logEntry);
                localStorage.setItem('wishes_hub_audit_logs', JSON.stringify(existingLogs.slice(0, 500)));
            }

            return { success: true };
        } catch (error) {
            console.error('Failed to log sign-in event to system-logs:', error);
            return { success: false, error: error.message };
        }
    }
};
