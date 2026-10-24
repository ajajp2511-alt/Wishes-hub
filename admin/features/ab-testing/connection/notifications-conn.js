/**
 * A/B Testing to Notifications Connection
 * Path: admin/features/ab-testing/connection/notifications-conn.js
 * Dispatches alerts when an experiment variant wins automatically, rollback occurs, or kill switch is triggered.
 */

import { notificationsCoreInstance } from '../../notifications/notifications-core.js';

export const AbTestingNotificationsConn = {
    async sendExperimentAlert(title, message, type = 'INFO') {
        try {
            const payload = {
                title: `🧪 A/B Testing: ${title}`,
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
            console.error('Failed to dispatch A/B testing notification:', error);
            return { success: false, error: error.message };
        }
    }
};
