/**
 * Affiliate to System Logs Connection
 * Path: admin/features/affiliate/connection/system-logs-conn.js
 * Logs affiliate link creations, currency conversions, API hub requests, and payout events to audit logs.
 */

import { logsCoreInstance } from '../../system-logs/logs-core.js';

export const AffiliateLogsConn = {
    async logAffiliateEvent(eventType, affiliateId, details = {}) {
        try {
            const logEntry = {
                timestamp: new Date().toISOString(),
                module: 'affiliate',
                eventType: eventType || 'AFFILIATE_ACTIVITY',
                identifier: affiliateId || 'AFFILIATE_PROGRAM',
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
            console.error('Failed to log affiliate event:', error);
            return { success: false, error: error.message };
        }
    }
};
