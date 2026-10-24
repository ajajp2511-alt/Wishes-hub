/**
 * User-Permissions to Notifications Connection
 * Dispatches alerts when admin roles or sensitive access permissions are modified.
 */

import { notificationsCoreInstance } from '../../notifications/notifications-core.js';

export const UserPermissionsNotificationsConn = {
    async sendPermissionAlert(targetAdmin, changeDescription) {
        try {
            const payload = {
                title: 'Admin Permissions Updated',
                body: `Permissions for ${targetAdmin} were modified: ${changeDescription}`,
                type: 'SECURITY_ALERT',
                timestamp: new Date().toISOString()
            };

            if (notificationsCoreInstance && typeof notificationsCoreInstance.dispatch === 'function') {
                await notificationsCoreInstance.dispatch(payload);
            } else {
                const notifs = JSON.parse(localStorage.getItem('wishes_hub_admin_notifications') || '[]');
                notifs.unshift(payload);
                localStorage.setItem('wishes_hub_admin_notifications', JSON.stringify(notifs));
            }

            return { success: true };
        } catch (error) {
            console.error('Failed to send permission notification:', error);
            return { success: false, error: error.message };
        }
    }
};
