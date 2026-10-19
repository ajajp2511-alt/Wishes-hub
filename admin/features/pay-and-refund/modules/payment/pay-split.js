/**
 * Module: pay-and-refund
 * Sub-folder: payment/
 * File: pay-split.js
 * Description: Multi-vendor automated split payouts engine.
 */

class PaySplit {
    /**
     * Calculate split payout shares between platform and vendors
     */
    calculateSplit(amount, vendorSplits = [], platformFeePercent = 10.0) {
        const totalAmount = parseFloat(amount);
        if (isNaN(totalAmount) || totalAmount <= 0) {
            throw new Error('Invalid total amount for split calculation.');
        }

        const platformFee = parseFloat(((totalAmount * platformFeePercent) / 100).toFixed(2));
        const distributableAmount = totalAmount - platformFee;

        const vendorPayouts = vendorSplits.map(vendor => {
            const shareAmount = parseFloat(((distributableAmount * vendor.percentage) / 100).toFixed(2));
            return {
                vendorId: vendor.vendorId,
                percentage: vendor.percentage,
                shareAmount
            };
        });

        return {
            totalAmount,
            platformFeePercent,
            platformFee,
            distributableAmount,
            vendorPayouts
        };
    }
}

module.exports = new PaySplit();
