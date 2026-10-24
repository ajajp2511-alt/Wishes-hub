/**
 * 3D Engine to Notifications Connection
 * Path: admin/features/3d/connection/notifications-conn.js
 * Dispatches notifications when 3D asset optimization, AI generation, or telegram sync finishes.
 */

import { notificationsCoreInstance } from '../../notifications/notifications-core.js';

export const Master3DNotificationsConn = {
    async send3DAlert(title, message, type = 'INFO') {
        try {
            const payload = {
                title: `🎮 3D Studio: ${title}`,
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
            console.error('Failed to dispatch 3D notification:', error);
            return { success: false, error: error.message };
        }
    }
};
