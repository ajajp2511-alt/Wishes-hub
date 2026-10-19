/**
 * Module: pay-and-refund
 * Sub-folder: refund/
 * File: refund-partial.js
 * Description: Proportional partial refund calculation engine with tax adjustment.
 */

class RefundPartial {
    /**
     * Calculate proportional refund amount including tax and surcharge adjustments
     */
    calculatePartialRefund(params) {
        const { originalBaseAmount, originalTaxAmount, originalSurchargeAmount, refundPercentage } = params;

        const percent = parseFloat(refundPercentage);
        if (isNaN(percent) || percent <= 0 || percent > 100) {
            throw new Error('Invalid refund percentage provided. Must be between 1 and 100.');
        }

        const baseRefund = parseFloat(((originalBaseAmount * percent) / 100).toFixed(2));
        const taxRefund = parseFloat(((originalTaxAmount || 0) * percent / 100).toFixed(2));
        const surchargeRefund = parseFloat(((originalSurchargeAmount || 0) * percent / 100).toFixed(2));
        
        const totalRefundAmount = parseFloat((baseRefund + taxRefund + surchargeRefund).toFixed(2));

        return {
            refundPercentage: percent,
            baseRefund,
            taxRefund,
            surchargeRefund,
            totalRefundAmount
        };
    }
}

module.exports = new RefundPartial();
