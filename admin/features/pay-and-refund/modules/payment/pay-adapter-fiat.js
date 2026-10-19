/**
 * Module: pay-and-refund
 * Sub-folder: payment/
 * File: pay-adapter-fiat.js
 * Description: Fiat gateway adapter for Cards, UPI, GPay, and Apple Pay.
 */

class PayAdapterFiat {
    /**
     * Process fiat payment request
     */
    async processPayment(paymentDetails) {
        const { transactionId, amount, currency = 'INR', method = 'UPI' } = paymentDetails;

        // Gateway API simulation
        const gatewayTxId = `FIAT_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

        return {
            status: 'SUCCESS',
            transactionId,
            gatewayTransactionId: gatewayTxId,
            paymentMethod: method,
            amount: parseFloat(amount),
            currency,
            processedAt: new Date().toISOString()
        };
    }
}

module.exports = new PayAdapterFiat();
