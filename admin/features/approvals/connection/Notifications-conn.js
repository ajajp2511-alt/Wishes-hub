/**
 * Approvals to Notifications Connection
 * Path: admin/features/approvals/connection/notifications-conn.js
 * Dispatches status updates and alerts regarding approval queues to users and admins.
 */

import { notificationsCoreInstance } from '../../notifications/notifications-core.js';

export const ApprovalsNotificationsConn = {
    async sendApprovalAlert(title, message, type = 'INFO') {
        try {
            const payload = {
                title: `🛡️ Approval Notice: ${title}`,
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
            console.error('Failed to dispatch approval notification:', error);
            return { success: false, error: error.message };
        }
    }
};
