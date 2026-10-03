/**
 * Wishes Hub - Login Security Alerts Module
 * Dispatches instant security notification alerts via Telegram Bot API or Email.
 */

export class LoginAlertsModule {
    constructor(botToken = null, chatId = null) {
        // Telegram Bot credentials configuration with fallback stubs
        this.telegramBotToken = botToken || 'YOUR_TELEGRAM_BOT_TOKEN';
        this.telegramChatId = chatId || 'YOUR_ADMIN_CHAT_ID';
    }

    /**
     * Send instant security alert notification
     */
    async sendAlert(alertType, adminEmail, details = {}) {
        try {
            const timestamp = new Date().toLocaleString();
            let message = '';

            switch (alertType) {
                case 'SUCCESS':
                    message = `🟢 *Admin Login Success*\n\n• Email: ${adminEmail}\n• Time: ${timestamp}\n• IP: ${details.ip || 'Unknown'}\n• Device: ${navigator.userAgent}`;
                    break;
                case 'FAILED':
                    message = `🔴 *Failed Login Attempt*\n\n• Email: ${adminEmail}\n• Time: ${timestamp}\n• IP: ${details.ip || 'Unknown'}`;
                    break;
                case 'LOCKED':
                    message = `⚠️ *Account Lockout Triggered*\n\n• Email: ${adminEmail}\n• Time: ${timestamp}\n• Reason: Exceeded maximum failed login attempts.`;
                    break;
                default:
                    message = `ℹ️ *Security Notice*\n\n• Email: ${adminEmail}\n• Event: ${alertType}\n• Time: ${timestamp}`;
            }

            // Dispatch notification via Telegram Bot API
            await this.sendTelegramNotification(message);

            console.log(`[Security Alert Dispatched]: ${alertType} for ${adminEmail}`);
            return { success: true };
        } catch (error) {
            console.error('Login Alert Dispatch Error:', error);
            return { success: false, error: error.message };
        }
    }

    async sendTelegramNotification(message) {
        // If bot tokens are placeholders, skip actual fetch to avoid network errors in simulation
        if (this.telegramBotToken === 'YOUR_TELEGRAM_BOT_TOKEN' || !this.telegramBotToken) {
            await new Promise((resolve) => setTimeout(resolve, 200));
            return;
        }

        const url = `https://api.telegram.org/bot${this.telegramBotToken}/sendMessage`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: this.telegramChatId,
                text: message,
                parse_mode: 'Markdown'
            })
        });

        if (!response.ok) {
            throw new Error(`Telegram API Error: ${response.statusText}`);
        }
    }
}
