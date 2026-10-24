/**
 * Login to Security Shield Connection
 * Bridges login checks with WAF blacklists, session shields, and threat defense.
 */

import { securityCoreInstance } from '../../security-shield/security-core.js';

export const LoginSecurityShieldConn = {
    async evaluateLoginSecurity(ipAddress) {
        try {
            if (securityCoreInstance && typeof securityCoreInstance.fetchThreatLogs === 'function') {
                await securityCoreInstance.fetchThreatLogs();
            }

            const isBlacklisted = securityCoreInstance.blacklistedIPs 
                ? securityCoreInstance.blacklistedIPs.has(ipAddress) 
                : false;

            if (isBlacklisted) {
                return {
                    allowed: false,
                    reason: 'Access denied: IP address is blacklisted by Security Shield.'
                };
            }

            return { allowed: true };
        } catch (error) {
            console.error('Security evaluation error during login:', error);
            return { allowed: true };
        }
    }
};
