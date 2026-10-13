/**
 * Admin Sign-In Module - Instant Telegram Notification Handler
 * Sends immediate alerts to Super Admin upon new admin access request or high-risk sign-in.
 */

export class SignInWebhook {
    static async notifySuperAdmin(eventType, payload) {
        try {
            const message = this.formatAlertMessage(eventType, payload);

            // Mock endpoint request (Replace with real Telegram Bot API or backend webhook route)
            console.log('[Telegram Alert Dispatched]:', message);

            return { success: true, notifiedAt: new Date().toISOString() };
        } catch (err) {
            console.error('[Webhook Notification Error]:', err);
            return { success: false, error: err.message };
        }
    }

    static formatAlertMessage(eventType, data) {
        if (eventType === 'NEW_ADMIN_REQUEST') {
            return `🚨 *NEW ADMIN ACCESS REQUEST* 🚨\n\n` +
                   `*Name:* ${data.fullName}\n` +
                   `*Email:* ${data.email}\n` +
                   `*Mobile:* ${data.mobile}\n` +
                   `*Requested Role:* ${data.requestedRole}\n` +
                   `*Cover Note:* ${data.coverNote}\n\n` +
                   ` Please review and approve in the Super Admin Dashboard.`;
        }
        
        return `⚠️ *SECURITY ALERT*: Unrecognized sign-in activity on ${data.email || 'Admin Panel'}.`;
    }
}
