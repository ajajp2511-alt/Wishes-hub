/**
 * Module: pay-and-refund
 * Sub-folder: refund/
 * File: refund-method-fallback.js
 * Description: Failed original route fallback to wallet or UPI.
 */

class RefundMethodFallback {
    /**
     * Determine fallback route when primary payment method fails
     */
    resolveFallbackRoute(params) {
        const { originalMethod, failureReason } = params;

        let fallbackRoute = 'WISHES_WALLET';
        if (originalMethod === 'UPI' || originalMethod === 'BANK_TRANSFER') {
            fallbackRoute = 'DIRECT_UPI_TRANSFER';
        }

        return {
            originalMethod,
            failureReason: failureReason || 'Gateway rejection or expired card',
            fallbackRoute,
            actionRequired: `Route refunded amount to user via ${fallbackRoute}`
        };
    }
}

module.exports = new RefundMethodFallback();
