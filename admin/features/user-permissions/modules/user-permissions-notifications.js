/**
 * User Permissions - Notifications Sub-Module
 * Manages push notification permissions and alerts for festival wishes.
 */

import { userPermissionsCore } from '../user-permissions-core.js';
import { PERMISSION_TYPES } from '../user-permissions-config.js';

export class UserPermissionsNotifications {
    static async requestAndRegister() {
        const result = await userPermissionsCore.requestNotification();
        if (result === 'granted') {
            // Placeholder for FCM or Push Subscription logic
            console.log('Notification permission granted. Ready for subscription sync.');
        }
        return result;
    }

    static checkStatus() {
        return userPermissionsCore.getPermissionState(PERMISSION_TYPES.NOTIFICATIONS);
    }
}
