/**
 * Real-Time Telegram & Email Status Update Dispatcher
 * File: admin/features/approvals/modules/approval-notifier.js
 */

export class ApprovalNotifier {
    /**
     * Dispatch Status Update Notification
     */
    dispatchStatusUpdate(request, decisionStatus) {
        const payload = {
            requestId: request.id,
            title: request.title,
            scope: request.scope,
            status: decisionStatus,
            applicantEmail: request.applicant?.email || 'N/A',
            timestamp: new Date().toISOString()
        };

        console.log(`[ApprovalNotifier Dispatcher]: Sending Telegram & Email alert for ${request.id} -> Status: ${decisionStatus}`);
        
        // Simulating webhook dispatch or email trigger
        this.triggerTelegramWebhook(payload);
        return true;
    }

    /**
     * Simulate Telegram Bot Alert Webhook
     */
    triggerTelegramWebhook(payload) {
        const message = `🔔 *Wishes Hub Approval Alert*\n\n` +
                        `• ID: \`${payload.requestId}\`\n` +
                        `• Title: ${payload.title}\n` +
                        `• Scope: ${payload.scope}\n` +
                        `• Decision: *${payload.status}*\n` +
                        `• Time: ${new Date(payload.timestamp).toLocaleString()}`;
        
        // In actual production, fetch('https://api.telegram.org/bot<TOKEN>/sendMessage', ...)
        console.log('[Telegram Bot Simulation]:', message);
    }
}
