/**
 * Wishes Hub - Session Shield Module
 * Defends against session hijacking by binding authentication tokens to device fingerprints.
 */

import { TrustedDeviceModule } from './trusted-device.js';

export class SessionShield {
    constructor() {
        this.shieldKey = 'wh_session_shield_hash';
        this.trustedDeviceModule = new TrustedDeviceModule();
        this.salt = 'wh_secure_salt_2026';
    }

    /**
     * Bind current session to the device fingerprint upon successful login
     */
    async establishShield() {
        try {
            const fingerprint = await this.trustedDeviceModule.generateFingerprint();
            const rawData = fingerprint + '---' + this.salt;
            
            // Generate secure hash using Web Crypto API if available, fallback to btoa
            const shieldHash = await this.hashString(rawData);
            
            localStorage.setItem(this.shieldKey, shieldHash);
            console.log('Session Shield established successfully.');
        } catch (error) {
            console.error('Establish Shield Error:', error);
        }
    }

    /**
     * Validate current session against active device fingerprint to prevent hijacking
     */
    async validateShield() {
        try {
            const storedShield = localStorage.getItem(this.shieldKey);
            if (!storedShield) {
                return { valid: false, reason: 'No session shield token found.' };
            }

            const currentFingerprint = await this.trustedDeviceModule.generateFingerprint();
            const rawData = currentFingerprint + '---' + this.salt;
            const expectedShield = await this.hashString(rawData);

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
     * Helper to create a secure SHA-256 hash with btoa fallback
     */
    async hashString(message) {
        if (window.crypto && window.crypto.subtle) {
            const msgBuffer = new TextEncoder().encode(message);
            const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        }
        // Fallback for older environments
        return btoa(message);
    }

    /**
     * Clear session shield on explicit logout
     */
    clearShield() {
        localStorage.removeItem(this.shieldKey);
    }
}
