/**
 * Ads to Security Shield Connection
 * Path: admin/features/ads/connection/security-shield-conn.js
 * Syncs ad fraud detection data, malicious click patterns, and unsafe ad creatives with Security Shield WAF.
 */

import { securityCoreInstance } from '../../security-shield/security-core.js';

export const AdsSecurityShieldConn = {
    async reportAdFraudThreat(fraudData) {
        try {
            if (securityCoreInstance && typeof securityCoreInstance.recordThreat === 'function') {
                await securityCoreInstance.recordThreat({
                    ip: fraudData.ip || 'AD_CLIENT_IP',
                    attackType: fraudData.type || 'CLICK_FRAUD_DETECTED',
                    severity: 'HIGH',
                    timestamp: Date.now(),
                    details: fraudData
                });
            }

            return { success: true };
        } catch (error) {
            console.error('Failed to report ad fraud threat to security shield:', error);
            return { success: false, error: error.message };
        }
    }
};
