/**
 * Module: pay-and-refund
 * Sub-folder: refund/
 * File: refund-tracking.js
 * Description: Live tracking, status updates, and notifications.
 */

class RefundTracking {
    constructor() {
        this.trackingStore = new Map();
    }

    /**
     * Initialize refund tracking state
     */
    createTracker(refundId, transactionId, userId, amount) {
        const trackRecord = {
            refundId,
            transactionId,
            userId,
            amount,
            status: 'INITIATED',
            history: [
                { status: 'INITIATED', timestamp: new Date().toISOString(), note: 'Refund request received.' }
            ]
        };

        this.trackingStore.set(refundId, trackRecord);
        return trackRecord;
    }

    /**
     * Update status and append tracking history
     */
    updateStatus(refundId, newStatus, note) {
        const record = this.trackingStore.get(refundId);
        if (!record) {
            throw new Error(`Refund tracking ID ${refundId} not found.`);
        }

        record.status = newStatus;
        record.history.push({
            status: newStatus,
            timestamp: new Date().toISOString(),
            note: note || `Status updated to ${newStatus}`
        });

        return record;
    }
}

module.exports = new RefundTracking();
