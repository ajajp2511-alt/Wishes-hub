/**
 * Analytics to Notifications Connection
 * Path: admin/features/analytics/connection/notifications-conn.js
 * Dispatches high-priority viral alerts or performance warnings from the analytics studio.
 */

import { notificationsCoreInstance } from '../../notifications/notifications-core.js';

export const AnalyticsNotificationsConn = {
    async sendAnalyticsAlert(title, message, type = 'INFO') {
        try {
            const payload = {
                title: `📊 Analytics Insight: ${title}`,
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
            console.error('Failed to dispatch analytics notification:', error);
            return { success: false, error: error.message };
        }
    }
};
