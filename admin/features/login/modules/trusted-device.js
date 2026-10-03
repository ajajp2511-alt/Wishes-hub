/**
 * Wishes Hub - Trusted Device Module
 * Handles browser/device fingerprinting and stores trusted device tokens.
 */

import { LoginConfig } from '../login-config.js';

export class TrustedDeviceModule {
    constructor() {
        this.storageKey = 'wh_trusted_devices';
    }

    /**
     * Generate a lightweight device fingerprint based on browser characteristics
     */
    generateFingerprint() {
        const nav = window.navigator;
        const screen = window.screen;
        
        const rawData = [
            nav.userAgent || '',
            nav.language || '',
            nav.hardwareConcurrency || 'unknown',
            screen.colorDepth || '',
            (screen.width || 0) + 'x' + (screen.height || 0),
            new Date().getTimezoneOffset()
        ].join('||');

        // Simple hash function for fingerprint string
        let hash = 0;
        for (let i = 0; i < rawData.length; i++) {
            const char = rawData.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash |= 0; // Convert to 32bit integer
        }
        return 'dev_fp_' + Math.abs(hash).toString(16);
    }

    /**
     * Check if the current device/browser is marked as trusted
     */
    isDeviceTrusted(adminEmail) {
        if (!adminEmail) return false;

        try {
            const rawStore = localStorage.getItem(this.storageKey);
            const trustedStore = rawStore ? JSON.parse(rawStore) : {};
            const deviceId = this.generateFingerprint();
            
            if (trustedStore[adminEmail] && trustedStore[adminEmail][deviceId]) {
                const expiryTime = trustedStore[adminEmail][deviceId];
                if (Date.now() < expiryTime) {
                    return true;
                } else {
                    // Expired - clean up
                    delete trustedStore[adminEmail][deviceId];
                    if (Object.keys(trustedStore[adminEmail]).length === 0) {
                        delete trustedStore[adminEmail];
                    }
                    localStorage.setItem(this.storageKey, JSON.stringify(trustedStore));
                }
            }
            return false;
        } catch (error) {
            console.error('Trusted Device Check Error:', error);
            return false;
        }
    }

    /**
     * Save current device as trusted for a specified duration
     */
    trustCurrentDevice(adminEmail) {
        if (!adminEmail) return;

        try {
            const rawStore = localStorage.getItem(this.storageKey);
            const trustedStore = rawStore ? JSON.parse(rawStore) : {};
            const deviceId = this.generateFingerprint();
            const days = LoginConfig?.security?.trustedDeviceDays || 30;
            const expiryTime = Date.now() + (days * 24 * 60 * 60 * 1000);

            if (!trustedStore[adminEmail]) {
                trustedStore[adminEmail] = {};
            }

            trustedStore[adminEmail][deviceId] = expiryTime;
            localStorage.setItem(this.storageKey, JSON.stringify(trustedStore));
            console.log(`Device trusted successfully for ${adminEmail} for ${days} days.`);
        } catch (error) {
            console.error('Save Trusted Device Error:', error);
        }
    }
}
