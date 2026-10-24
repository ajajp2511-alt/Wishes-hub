/**
 * Security-Shield to Notifications Connection
 * Dispatches instant high-priority alerts to super admins upon detecting severe attacks or panic triggers.
 */

import { notificationsCoreInstance } from '../../notifications/notifications-core.js';

export const SecurityShieldNotificationsConn = {
    async sendSecurityAlert(title, message, severity = 'CRITICAL') {
        try {
            const payload = {
                title: `🚨 Security Shield: ${title}`,
                body: message,
                type: severity,
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
            console.error('Failed to dispatch security notification:', error);
            return { success: false, error: error.message };
        }
    }
};
