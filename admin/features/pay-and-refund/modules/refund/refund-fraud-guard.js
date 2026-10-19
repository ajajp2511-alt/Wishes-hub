/**
 * Module: pay-and-refund
 * Sub-folder: refund/
 * File: refund-fraud-guard.js
 * Description: Smart risk scoring, auto-reversal, and dispute guard.
 */

class RefundFraudGuard {
    constructor() {
        this.refundClaimsHistory = new Map();
    }

    /**
     * Evaluate refund claim risk score and detect abuse
     */
    evaluateRefundRisk(userId, transactionId) {
        const userClaims = this.refundClaimsHistory.get(userId) || [];
        
        const claimCount = userClaims.length + 1;
        this.refundClaimsHistory.set(userId, [...userClaims, transactionId]);

        let riskScore = 0;
        let requireManualApproval = false;

        if (claimCount > 2) {
            riskScore = 85;
            requireManualApproval = true;
        }

        return {
            userId,
            transactionId,
            historicalClaims: claimCount,
            riskScore,
            requireManualApproval,
            reason: requireManualApproval ? 'High frequency refund claims detected. Flagged for review.' : 'Low risk claim.'
        };
    }
}

module.exports = new RefundFraudGuard();
