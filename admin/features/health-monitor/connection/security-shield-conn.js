/**
 * Health-Monitor to Security Shield Connection
 * Path: admin/features/health-monitor/connection/security-shield-conn.js
 * Syncs traffic spikes, endpoint pings failures, and potential DDoS patterns with Security Shield WAF.
 */

import { securityCoreInstance } from '../../security-shield/security-core.js';

export const HealthMonitorSecurityShieldConn = {
    async reportInfrastructureThreat(targetEndpoint, issueType) {
        try {
            if (securityCoreInstance && typeof securityCoreInstance.recordThreat === 'function') {
                await securityCoreInstance.recordThreat({
                    ip: 'INFRASTRUCTURE_MONITOR',
                    attackType: issueType || 'TRAFFIC_SPIKE_ANOMALY',
                    severity: 'HIGH',
                    timestamp: Date.now(),
                    details: { endpoint: targetEndpoint }
                });
            }

            return { success: true };
        } catch (error) {
            console.error('Failed to report infrastructure threat to security shield:', error);
            return { success: false, error: error.message };
        }
    }
};
