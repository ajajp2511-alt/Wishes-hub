/**
 * System-Logs to Security Shield Connection
 * Syncs security audit logs, auth failures, and crash diagnostics with the threat shield intelligence.
 */

import { securityCoreInstance } from '../../security-shield/security-core.js';

export const SystemLogsSecurityShieldConn = {
    async syncSecurityLog(logEntry) {
        try {
            if (logEntry.module === 'security' || logEntry.severity === 'HIGH' || logEntry.severity === 'CRITICAL') {
                if (securityCoreInstance && typeof securityCoreInstance.recordThreat === 'function') {
                    await securityCoreInstance.recordThreat({
                        ip: logEntry.ip || 'unknown',
                        attackType: logEntry.eventType || 'AUTH_FAILURE',
                        severity: logEntry.severity || 'HIGH',
                        timestamp: logEntry.timestamp || Date.now()
                    });
                }
            }
            return { success: true };
        } catch (error) {
            console.error('Failed to sync log with security-shield:', error);
            return { success: false, error: error.message };
        }
    }
};
