/**
 * Login to Notifications Connection
 * Dispatches login alerts, OTP notifications, and security warnings.
 */

import { notificationsCoreInstance } from '../../notifications/notifications-core.js';

export const LoginNotificationsConn = {
    async sendLoginAlert(title, message, type = 'SECURITY') {
        try {
            const payload = {
                title: title,
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
            console.error('Failed to dispatch login notification:', error);
            return { success: false, error: error.message };
        }
    }
};
