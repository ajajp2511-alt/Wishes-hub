/**
 * Ads to Notifications Connection
 * Path: admin/features/ads/connection/notifications-conn.js
 * Dispatches alerts regarding ad campaign approvals, festival deal announcements, and WhatsApp digests.
 */

import { notificationsCoreInstance } from '../../notifications/notifications-core.js';

export const AdsNotificationsConn = {
    async sendAdAlert(title, message, type = 'INFO') {
        try {
            const payload = {
                title: `📢 Ads Campaign: ${title}`,
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
            console.error('Failed to dispatch ad notification:', error);
            return { success: false, error: error.message };
        }
    }
};
