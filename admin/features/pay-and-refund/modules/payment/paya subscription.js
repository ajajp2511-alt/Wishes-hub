/**
 * Module: pay-and-refund
 * Sub-folder: payment/
 * File: pay-subscription.js
 * Description: Recurring billing and auto-debit plans engine.
 */

class PaySubscription {
    constructor() {
        this.subscriptions = new Map();
    }

    /**
     * Create a new subscription plan for recurring payments
     */
    createSubscription(params) {
        const { userId, planId, amount, interval = 'monthly', currency = 'INR' } = params;

        const subscriptionId = `SUB-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
        
        const nextBillingDate = new Date();
        if (interval === 'monthly') {
            nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
        } else if (interval === 'yearly') {
            nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
        }

        const subRecord = {
            subscriptionId,
            userId,
            planId,
            amount: parseFloat(amount),
            interval,
            currency,
            status: 'ACTIVE',
            createdAt: new Date().toISOString(),
            nextBillingDate: nextBillingDate.toISOString()
        };

        this.subscriptions.set(subscriptionId, subRecord);
        return subRecord;
    }

    /**
     * Cancel an active subscription
     */
    cancelSubscription(subscriptionId) {
        const sub = this.subscriptions.get(subscriptionId);
        if (!sub) {
            throw new Error(`Subscription ID ${subscriptionId} not found.`);
        }

        sub.status = 'CANCELLED';
        sub.cancelledAt = new Date().toISOString();
        return sub;
    }
}

module.exports = new PaySubscription();
