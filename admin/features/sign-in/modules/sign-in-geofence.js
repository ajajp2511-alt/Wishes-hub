/**
 * Admin Sign-In Module - Geofence Guard
 * Ensures admin sign-in requests originate from permitted geographic regions.
 */

import { SIGN_IN_CONFIG } from '../sign-in-config.js';

export class SignInGeofence {
    static async checkGeofencePermission(clientCountryCode = 'IN') {
        try {
            const allowed = SIGN_IN_CONFIG.allowedCountries;
            if (!allowed.includes(clientCountryCode)) {
                return {
                    allowed: false,
                    reason: `Sign-In attempt country (${clientCountryCode}) is restricted.`
                };
            }

            return { allowed: true, country: clientCountryCode };
        } catch (err) {
            return { allowed: false, reason: 'Geofence verification error: ' + err.message };
        }
    }
}
