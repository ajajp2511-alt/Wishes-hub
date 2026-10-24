/**
 * Approvals to System Logs Connection
 * Path: admin/features/approvals/connection/system-logs-conn.js
 * Logs approval decisions, rejections, and revision requests to the audit trail.
 */

import { logsCoreInstance } from '../../system-logs/logs-core.js';

export const ApprovalsLogsConn = {
    async logApprovalEvent(eventType, requestId, details = {}) {
        try {
            const logEntry = {
                timestamp: new Date().toISOString(),
                module: 'approvals',
                eventType: eventType || 'APPROVAL_DECISION_MADE',
                identifier: requestId || 'APPROVAL_ITEM',
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
            console.error('Failed to log approval event:', error);
            return { success: false, error: error.message };
        }
    }
};
