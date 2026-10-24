/**
 * Affiliate to Notifications Connection
 * Path: admin/features/affiliate/connection/notifications-conn.js
 * Dispatches push alerts regarding referral earnings, festival campaign triggers, and payout status updates.
 */

import { notificationsCoreInstance } from '../../notifications/notifications-core.js';

export const AffiliateNotificationsConn = {
    async sendAffiliateAlert(title, message, type = 'INFO') {
        try {
            const payload = {
                title: `💰 Affiliate Program: ${title}`,
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
            console.error('Failed to dispatch affiliate notification:', error);
            return { success: false, error: error.message };
        }
    }
};
