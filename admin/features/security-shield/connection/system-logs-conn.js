/**
 * Security-Shield to System Logs Connection
 * Logs WAF blocks, IP bans, bot attacks, and emergency lockdowns to the system audit trail.
 */

import { logsCoreInstance } from '../../system-logs/logs-core.js';

export const SecurityShieldLogsConn = {
    async logThreatEvent(threatData) {
        try {
            const logEntry = {
                timestamp: new Date().toISOString(),
                module: 'security-shield',
                eventType: threatData.attackType || 'SECURITY_THREAT_BLOCKED',
                identifier: threatData.ip || 'unknown',
                severity: threatData.severity || 'HIGH',
                metadata: threatData
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
            console.error('Failed to log security threat:', error);
            return { success: false, error: error.message };
        }
    }
};
