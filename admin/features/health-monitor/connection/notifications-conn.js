/**
 * Health-Monitor to Notifications Connection
 * Path: admin/features/health-monitor/connection/notifications-conn.js
 * Dispatches high-priority uptime and error alerts to administrators.
 */

import { notificationsCoreInstance } from '../../notifications/notifications-core.js';

export const HealthMonitorNotificationsConn = {
    async sendHealthAlert(title, message, severity = 'CRITICAL') {
        try {
            const payload = {
                title: `🏥 Health Monitor: ${title}`,
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
            console.error('Failed to dispatch health notification:', error);
            return { success: false, error: error.message };
        }
    }
};
