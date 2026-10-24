/**
 * AI & Automation to Security Shield Connection
 * Path: admin/features/ai-automation/connection/security-shield-conn.js
 * Syncs prompt injection attempts, severe toxicity flags, or unusual token drainage with Security Shield.
 */

import { securityCoreInstance } from '../../security-shield/security-core.js';

export const AiAutomationSecurityShieldConn = {
    async reportPromptThreat(threatData) {
        try {
            if (securityCoreInstance && typeof securityCoreInstance.recordThreat === 'function') {
                await securityCoreInstance.recordThreat({
                    ip: threatData.ip || 'AI_PROMPT_USER',
                    attackType: threatData.type || 'PROMPT_INJECTION_DETECTED',
                    severity: threatData.severity || 'HIGH',
                    timestamp: Date.now(),
                    details: threatData
                });
            }

            return { success: true };
        } catch (error) {
            console.error('Failed to report prompt threat to security shield:', error);
            return { success: false, error: error.message };
        }
    }
};
