/**
 * AI & Automation to Notifications Connection
 * Path: admin/features/ai-automation/connection/notifications-conn.js
 * Dispatches alerts regarding token budget limits, toxic content flags, or seasonal auto-pilot completions.
 */

import { notificationsCoreInstance } from '../../notifications/notifications-core.js';

export const AiAutomationNotificationsConn = {
    async sendAiAlert(title, message, type = 'INFO') {
        try {
            const payload = {
                title: `🤖 AI Automation: ${title}`,
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
            console.error('Failed to dispatch AI automation notification:', error);
            return { success: false, error: error.message };
        }
    }
};
