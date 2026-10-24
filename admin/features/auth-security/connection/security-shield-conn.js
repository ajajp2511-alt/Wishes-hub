/**
 * Auth-Security to Security Shield Connection
 * Path: admin/features/auth-security/connection/security-shield-conn.js
 * Syncs brute-force threats and anomaly detection with Threat Shield WAF.
 */

import { securityCoreInstance } from '../../security-shield/security-core.js';

export const AuthSecurityShieldConn = {
    async reportThreatToShield(ipAddress, threatType, severity = 'HIGH') {
        try {
            if (securityCoreInstance && typeof securityCoreInstance.recordThreat === 'function') {
                await securityCoreInstance.recordThreat({
                    ip: ipAddress || 'unknown',
                    attackType: threatType || 'ANOMALY_DETECTED',
                    severity: severity,
                    timestamp: Date.now()
                });
            }

            return { success: true };
        } catch (error) {
            console.error('Failed to report threat to security shield:', error);
            return { success: false, error: error.message };
        }
    }
};
