/**
 * Module: pay-and-refund
 * Sub-folder: payment/
 * File: pay-surcharge.js
 * Description: Dynamic auto-surcharge fee calculation engine.
 */

const config = require('../../pay-refund-config');

class PaySurcharge {
    /**
     * Calculate gateway surcharge fee based on payment method and amount
     */
    calculateSurcharge(amount, paymentMethod = 'fiat') {
        const baseAmount = parseFloat(amount);
        if (isNaN(baseAmount) || baseAmount <= 0) {
            throw new Error('Invalid amount provided for surcharge calculation.');
        }

        let feePercent = config.surcharge?.fiatGatewayFeePercent || 2.5;

        if (paymentMethod === 'crypto') {
            feePercent = config.surcharge?.cryptoGatewayFeePercent || 1.0;
        } else if (paymentMethod === 'bnpl') {
            feePercent = 3.5;
        }

        const surchargeAmount = parseFloat(((baseAmount * feePercent) / 100).toFixed(2));
        const totalWithSurcharge = parseFloat((baseAmount + surchargeAmount).toFixed(2));

        return {
            baseAmount,
            paymentMethod,
            surchargePercent: feePercent,
            surchargeAmount,
            totalWithSurcharge
        };
    }
}

module.exports = new PaySurcharge();
