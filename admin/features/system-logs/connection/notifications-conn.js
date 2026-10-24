/**
 * System-Logs to Notifications Connection
 * Triggers instant alerts and web pushes when critical system logs, crashes, or security events occur.
 */

import { notificationsCoreInstance } from '../../notifications/notifications-core.js';

export const SystemLogsNotificationsConn = {
    async dispatchCriticalAlert(logData) {
        try {
            const alertPayload = {
                title: `Critical Alert: ${logData.eventType || 'System Event'}`,
                body: logData.message || 'A critical error or security event was logged in the system.',
                type: 'CRITICAL_LOG',
                timestamp: new Date().toISOString()
            };

            if (notificationsCoreInstance && typeof notificationsCoreInstance.dispatch === 'function') {
                await notificationsCoreInstance.dispatch(alertPayload);
            } else {
                const existingNotifs = JSON.parse(localStorage.getItem('wishes_hub_admin_notifications') || '[]');
                existingNotifs.unshift(alertPayload);
                localStorage.setItem('wishes_hub_admin_notifications', JSON.stringify(existingNotifs));
            }

            return { success: true };
        } catch (error) {
            console.error('Failed to dispatch notification from system-logs:', error);
            return { success: false, error: error.message };
        }
    }
};
