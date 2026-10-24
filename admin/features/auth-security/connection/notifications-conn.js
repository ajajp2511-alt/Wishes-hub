/**
 * Auth-Security to Notifications Connection
 * Path: admin/features/auth-security/connection/notifications-conn.js
 * Dispatches high-priority security warnings and MFA alerts.
 */

import { notificationsCoreInstance } from '../../notifications/notifications-core.js';

export const AuthSecurityNotificationsConn = {
    async sendSecurityAlert(title, message, severity = 'CRITICAL') {
        try {
            const payload = {
                title: `🛡️ Security Alert: ${title}`,
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
