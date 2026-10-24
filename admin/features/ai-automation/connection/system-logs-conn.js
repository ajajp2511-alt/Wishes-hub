/**
 * AI & Automation to System Logs Connection
 * Path: admin/features/ai-automation/connection/system-logs-conn.js
 * Logs AI generations, auto-pilot triggers, content moderation flags, and token cost thresholds to audit logs.
 */

import { logsCoreInstance } from '../../system-logs/logs-core.js';

export const AiAutomationLogsConn = {
    async logAiEvent(eventType, identifier, details = {}) {
        try {
            const logEntry = {
                timestamp: new Date().toISOString(),
                module: 'ai-automation',
                eventType: eventType || 'AI_GENERATION_TASK',
                identifier: identifier || 'AI_STUDIO',
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
            console.error('Failed to log AI automation event:', error);
            return { success: false, error: error.message };
        }
    }
};
