/**
 * Module: pay-and-refund
 * Sub-folder: refund/
 * File: refund-wallet.js
 * Description: Instant wallet credit & 5% bonus incentive engine.
 */

const core = require('../../pay-refund-core');
const config = require('../../pay-refund-config');

class RefundWallet {
    /**
     * Credit refund to wallet with optional 5% bonus incentive
     */
    processWalletRefund(userId, refundAmount, chooseBonus = true) {
        const amount = parseFloat(refundAmount);
        const bonusPercent = config.refund?.walletBonusPercent || 5.0;

        let creditAmount = amount;
        let bonusAdded = 0;

        if (chooseBonus) {
            bonusAdded = parseFloat(((amount * bonusPercent) / 100).toFixed(2));
            creditAmount = parseFloat((amount + bonusAdded).toFixed(2));
        }

        const updatedWallet = core.creditWallet(userId, creditAmount, chooseBonus);

        return {
            status: 'WALLET_CREDITED_SUCCESS',
            userId,
            originalRefundAmount: amount,
            bonusIncentivePercent: chooseBonus ? bonusPercent : 0,
            bonusAmountAdded: bonusAdded,
            totalCredited: creditAmount,
            walletSummary: updatedWallet
        };
    }
}

module.exports = new RefundWallet();
