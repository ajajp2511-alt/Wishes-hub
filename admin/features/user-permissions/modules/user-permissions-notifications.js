/**
 * User Permissions - Notifications Sub-Module (Enhanced)
 * Manages push notification permissions and alerts for festival wishes.
 */

import { userPermissionsCore } from '../user-permissions-core.js';
import { PERMISSION_TYPES } from '../user-permissions-config.js';

export class UserPermissionsNotifications {
    static async requestAndRegister() {
        if (!('Notification' in window)) {
            userPermissionsCore.setPermissionState(PERMISSION_TYPES.NOTIFICATIONS, 'unsupported');
            return { success: false, reason: 'unsupported' };
        }

        try {
            const result = await userPermissionsCore.requestNotification();
            if (result === 'granted') {
                userPermissionsCore.setPermissionState(PERMISSION_TYPES.NOTIFICATIONS, 'granted');
                // Placeholder for FCM or Push Subscription logic
                console.log('Notification permission granted. Ready for subscription sync.');
                return { success: true, status: 'granted' };
            } else {
                userPermissionsCore.setPermissionState(PERMISSION_TYPES.NOTIFICATIONS, 'denied');
                return { success: false, status: result };
            }
        } catch (err) {
            userPermissionsCore.setPermissionState(PERMISSION_TYPES.NOTIFICATIONS, 'error');
            return { success: false, error: err.message };
        }
    }

    static checkStatus() {
        if (!('Notification' in window)) {
            return 'unsupported';
        }
        return userPermissionsCore.getPermissionState(PERMISSION_TYPES.NOTIFICATIONS);
    }
}
