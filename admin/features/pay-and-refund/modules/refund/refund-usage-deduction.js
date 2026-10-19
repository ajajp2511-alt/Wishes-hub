/**
 * Module: pay-and-refund
 * Sub-folder: refund/
 * File: refund-usage-deduction.js
 * Description: Prorated usage-based deduction engine for digital services.
 */

class RefundUsageDeduction {
    /**
     * Calculate refund after deducting consumed usage percentage
     */
    calculateUsageDeduction(params) {
        const { originalAmount, consumedPercentage = 0 } = params;
        const amount = parseFloat(originalAmount);
        const consumed = parseFloat(consumedPercentage);

        if (consumed < 0 || consumed > 100) {
            throw new Error('Consumed percentage must be between 0 and 100.');
        }

        const remainingPercentage = 100 - consumed;
        const refundableAmount = parseFloat(((amount * remainingPercentage) / 100).toFixed(2));
        const deductedAmount = parseFloat((amount - refundableAmount).toFixed(2));

        return {
            originalAmount: amount,
            consumedPercentage: consumed,
            deductedAmount,
            refundableAmount
        };
    }
}

module.exports = new RefundUsageDeduction();
