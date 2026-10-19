/**
 * Module: pay-and-refund
 * Sub-folder: refund/
 * File: refund-processor.js
 * Description: 24-hr refund form processor & policy validation engine.
 */

const config = require('../../pay-refund-config');

class RefundProcessor {
    constructor() {
        this.windowHours = config.refund?.windowHours || 24;
    }

    /**
     * Check if a transaction is eligible for refund based on 24-hour rule
     */
    validateRefundWindow(transactionCreatedAt) {
        const createdTime = new Date(transactionCreatedAt).getTime();
        const currentTime = Date.now();
        const diffHours = (currentTime - createdTime) / (1000 * 60 * 60);

        const isEligible = diffHours <= this.windowHours;

        return {
            isEligible,
            elapsedHours: parseFloat(diffHours.toFixed(2)),
            allowedWindowHours: this.windowHours,
            reason: isEligible 
                ? 'Transaction is within the strict 24-hour refund window.' 
                : 'Refund window of 24 hours has expired.'
        };
    }
}

module.exports = new RefundProcessor();
