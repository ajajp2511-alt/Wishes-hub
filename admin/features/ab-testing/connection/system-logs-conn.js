/**
 * A/B Testing to System Logs Connection
 * Path: admin/features/ab-testing/connection/system-logs-conn.js
 * Logs experiment status changes, winner promotions, rollbacks, and kill switch activations to audit trail.
 */

import { logsCoreInstance } from '../../system-logs/logs-core.js';

export const AbTestingLogsConn = {
    async logExperimentEvent(eventType, experimentId, details = {}) {
        try {
            const logEntry = {
                timestamp: new Date().toISOString(),
                module: 'ab-testing',
                eventType: eventType || 'EXPERIMENT_ACTION',
                identifier: experimentId || 'AB_EXPERIMENT',
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
            console.error('Failed to log A/B testing event:', error);
            return { success: false, error: error.message };
        }
    }
};
