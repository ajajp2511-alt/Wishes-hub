/**
 * User Permissions - Location Sub-Module (Enhanced)
 * Fetches geolocation to recommend regional and local festival wishes.
 */

import { userPermissionsCore } from '../user-permissions-core.js';
import { PERMISSION_TYPES } from '../user-permissions-config.js';

export class UserPermissionsLocation {
    static async requestLocation() {
        if (!('geolocation' in navigator)) {
            userPermissionsCore.setPermissionState(PERMISSION_TYPES.LOCATION, 'unsupported');
            return { success: false, reason: 'unsupported' };
        }

        return new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    userPermissionsCore.setPermissionState(PERMISSION_TYPES.LOCATION, 'granted');
                    resolve({
                        success: true,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy
                    });
                },
                (error) => {
                    userPermissionsCore.setPermissionState(PERMISSION_TYPES.LOCATION, 'denied');
                    resolve({ success: false, error: error.message, code: error.code });
                },
                { 
                    enableHighAccuracy: false, // Set to false for faster response and lower battery drain
                    timeout: 10000, 
                    maximumAge: 60000 
                }
            );
        });
    }

    static checkStatus() {
        if (!('geolocation' in navigator)) {
            return 'unsupported';
        }
        return userPermissionsCore.getPermissionState(PERMISSION_TYPES.LOCATION);
    }
}
