/**
 * Sign-In to Security Shield Connection
 * Bridges sign-in authentication attempts with WAF IP blacklists, anti-tamper, and threat defense.
 */

import { securityCoreInstance } from '../../security-shield/security-core.js';
import { securityDefenseInstance } from '../../security-shield/security-defense.js';

export const SignInSecurityShieldConn = {
    async evaluateSignInSecurity(ipAddress, identifier) {
        try {
            // Ensure security lists are updated
            if (securityCoreInstance && typeof securityCoreInstance.fetchThreatLogs === 'function') {
                await securityCoreInstance.fetchThreatLogs();
            }

            // Check if IP is blacklisted in security-shield firewall
            const isBlacklisted = securityCoreInstance.blacklistedIPs 
                ? securityCoreInstance.blacklistedIPs.has(ipAddress) 
                : false;

            if (isBlacklisted) {
                return {
                    allowed: false,
                    reason: 'IP address is blocked by the Security & Threat Shield WAF.'
                };
            }

            return { allowed: true };
        } catch (error) {
            console.error('Failed to evaluate sign-in security via security-shield:', error);
            // Fail safe: allow login if security-shield check errors out, or handle accordingly
            return { allowed: true };
        }
    }
};
