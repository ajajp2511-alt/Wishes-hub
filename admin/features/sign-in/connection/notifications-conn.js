/**
 * Sign-In to Notifications Connection
 * Bridges admin authentication events and access requests with the notifications broadcaster.
 */

import { notificationsCoreInstance } from '../../notifications/notifications-core.js';
import { WebPushAlertsModule } from '../../notifications/modules/web-push-alerts.js';

export const SignInNotificationsConn = {
    async sendAdminAlert(title, message, type = 'SECURITY') {
        try {
            const notificationPayload = {
                title: title,
                body: message,
                type: type,
                timestamp: new Date().toISOString()
            };

            // Dispatch via notifications core or web push alerts module
            if (notificationsCoreInstance && typeof notificationsCoreInstance.dispatch === 'function') {
                await notificationsCoreInstance.dispatch(notificationPayload);
            } else {
                // Fallback simulation or direct storage trigger
                const existingNotifs = JSON.parse(localStorage.getItem('wishes_hub_admin_notifications') || '[]');
                existingNotifs.unshift(notificationPayload);
                localStorage.setItem('wishes_hub_admin_notifications', JSON.stringify(existingNotifs));
            }

            return { success: true };
        } catch (error) {
            console.error('Failed to dispatch notification from sign-in:', error);
            return { success: false, error: error.message };
        }
    }
};
