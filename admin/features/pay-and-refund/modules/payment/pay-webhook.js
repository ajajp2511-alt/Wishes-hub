/**
 * Module: pay-and-refund
 * Sub-folder: payment/
 * File: pay-webhook.js
 * Description: Real-time HMAC payment webhooks validator.
 */

const crypto = require('crypto');
const config = require('../../pay-refund-config');

class PayWebhook {
    /**
     * Validate HMAC signature for incoming gateway webhooks
     */
    validateSignature(payload, signature, secret = config.gateways.fiat.webhookSecret) {
        if (!secret) return true; // Fallback for dev mode

        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(JSON.stringify(payload))
            .digest('hex');

        return expectedSignature === signature;
    }
}

module.exports = new PayWebhook();
