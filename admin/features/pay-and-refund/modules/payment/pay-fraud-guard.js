/**
 * Module: pay-and-refund
 * Sub-folder: payment/
 * File: pay-fraud-guard.js
 * Description: Real-time fraud risk scoring & velocity guard engine.
 */

class PayFraudGuard {
    constructor() {
        this.velocityTracker = new Map();
        this.maxAttemptsWindowMs = 5 * 60 * 1000; // 5 minutes
        this.maxAllowedAttempts = 3;
    }

    /**
     * Evaluate transaction fraud risk score
     */
    evaluateRisk(params) {
        const { userId, ipAddress, cardFingerprint } = params;
        const key = `${userId}_${ipAddress}`;

        const currentTime = Date.now();
        const userActivity = this.velocityTracker.get(key) || [];

        // Clean up old attempts outside window
        const recentAttempts = userActivity.filter(timestamp => (currentTime - timestamp) < this.maxAttemptsWindowMs);
        recentAttempts.push(currentTime);
        this.velocityTracker.set(key, recentAttempts);

        let riskScore = 0; // 0 (Safe) to 100 (High Risk)
        let blockTransaction = false;

        if (recentAttempts.length > this.maxAllowedAttempts) {
            riskScore += 75;
            blockTransaction = true;
        }

        return {
            userId,
            ipAddress,
            riskScore,
            attemptsInWindow: recentAttempts.length,
            blockTransaction,
            reason: blockTransaction ? 'High velocity payment attempts detected.' : 'Transaction deemed safe.'
        };
    }
}

module.exports = new PayFraudGuard();
