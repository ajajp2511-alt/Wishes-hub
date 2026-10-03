/**
 * Wishes Hub - Session Shield Module
 * Defends against session hijacking by binding authentication tokens to device fingerprints.
 */

import { TrustedDeviceModule } from './trusted-device.js';

export class SessionShield {
    constructor() {
        this.shieldKey = 'wh_session_shield_hash';
        this.trustedDeviceModule = new TrustedDeviceModule();
    }

    /**
     * Bind current session to the device fingerprint upon successful login
     */
    establishShield() {
        try {
            const fingerprint = this.trustedDeviceModule.generateFingerprint();
            // Create a secondary verification hash combining fingerprint and salt
            const shieldHash = btoa(fingerprint + '---wh_secure_salt_2026');
            localStorage.setItem(this.shieldKey, shieldHash);
            console.log('Session Shield established successfully.');
        } catch (error) {
            console.error('Establish Shield Error:', error);
        }
    }

    /**
     * Validate current session against active device fingerprint to prevent hijacking
     */
    validateShield() {
        try {
            const storedShield = localStorage.getItem(this.shieldKey);
            if (!storedShield) {
                return { valid: false, reason: 'No session shield token found.' };
            }

            const currentFingerprint = this.trustedDeviceModule.generateFingerprint();
            const expectedShield = btoa(currentFingerprint + '---wh_secure_salt_2026');

            if (storedShield !== expectedShield) {
                console.warn('Security Alert: Session hijacking attempt detected! Fingerprint mismatch.');
                return { 
                    valid: false, 
                    reason: 'Session integrity violation detected. Possible session hijacking.' 
                };
            }

            return { valid: true };
        } catch (error) {
            console.error('Validate Shield Error:', error);
            return { valid: false, reason: 'Shield validation exception.' };
        }
    }

    /**
     * Clear session shield on explicit logout
     */
    clearShield() {
        localStorage.removeItem(this.shieldKey);
    }
}
