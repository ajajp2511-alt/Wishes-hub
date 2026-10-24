/**
 * Analytics to Security Shield Connection
 * Path: admin/features/analytics/connection/security-shield-conn.js
 * Syncs suspicious bot traffic or traffic surge anomalies detected in Live Traffic with Security Shield WAF.
 */

import { securityCoreInstance } from '../../security-shield/security-core.js';

export const AnalyticsSecurityShieldConn = {
    async reportTrafficAnomaly(trafficData) {
        try {
            if (securityCoreInstance && typeof securityCoreInstance.recordThreat === 'function') {
                await securityCoreInstance.recordThreat({
                    ip: trafficData.ip || 'ANALYTICS_TRAFFIC_SOURCE',
                    attackType: trafficData.type || 'ABNORMAL_TRAFFIC_SURGE',
                    severity: 'MEDIUM',
                    timestamp: Date.now(),
                    details: trafficData
                });
            }

            return { success: true };
        } catch (error) {
            console.error('Failed to report traffic anomaly to security shield:', error);
            return { success: false, error: error.message };
        }
    }
};
