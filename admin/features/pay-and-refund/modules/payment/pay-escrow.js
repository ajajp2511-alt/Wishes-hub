/**
 * Module: pay-and-refund
 * Sub-folder: payment/
 * File: pay-escrow.js
 * Description: Dynamic escrow hold and payout locking engine.
 */

class PayEscrow {
    constructor() {
        this.escrowHolds = new Map();
        this.holdPeriodHours = 24; // Align with 24-hr refund policy
    }

    /**
     * Lock funds in escrow for a transaction
     */
    lockEscrow(transactionId, amount, vendorId) {
        const releaseTime = new Date(Date.now() + this.holdPeriodHours * 60 * 60 * 1000).toISOString();

        const holdRecord = {
            transactionId,
            vendorId,
            amount: parseFloat(amount),
            status: 'LOCKED',
            lockedAt: new Date().toISOString(),
            releaseTime
        };

        this.escrowHolds.set(transactionId, holdRecord);
        return holdRecord;
    }

    /**
     * Release locked funds to vendor if no refund claimed
     */
    releaseEscrow(transactionId) {
        const hold = this.escrowHolds.get(transactionId);
        if (!hold) {
            throw new Error(`No escrow hold found for transaction ID ${transactionId}`);
        }

        hold.status = 'RELEASED';
        hold.releasedAt = new Date().toISOString();
        return hold;
    }
}

module.exports = new PayEscrow();
