/**
 * Logo-Branding-Manager to Notifications Connection
 * Path: admin/features/logo-branding-manager/connection/notifications-conn.js
 * Dispatches alerts when global logos, watermarks, or studio themes are successfully synced or modified.
 */

import { notificationsCoreInstance } from '../../notifications/notifications-core.js';

export const LogoBrandingNotificationsConn = {
    async sendBrandingAlert(title, message, type = 'INFO') {
        try {
            const payload = {
                title: `🎨 Branding Update: ${title}`,
                body: message,
                type: type,
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
            console.error('Failed to dispatch branding notification:', error);
            return { success: false, error: error.message };
        }
    }
};
