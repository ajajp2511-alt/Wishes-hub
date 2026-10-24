/**
 * Manage-Home to Notifications Connection
 * Path: admin/features/manage-home/connection/notifications-conn.js
 * Dispatches broadcasts or high-priority announcements from the home dashboard.
 */

import { notificationsCoreInstance } from '../../notifications/notifications-core.js';

export const ManageHomeNotificationsConn = {
    async sendHomeBroadcast(title, message, type = 'INFO') {
        try {
            const payload = {
                title: `📢 Announcement: ${title}`,
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
            console.error('Failed to dispatch home notification:', error);
            return { success: false, error: error.message };
        }
    }
};
