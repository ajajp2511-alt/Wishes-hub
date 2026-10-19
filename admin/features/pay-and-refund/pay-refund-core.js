/**
 * Module: pay-and-refund
 * File: pay-refund-core.js
 * Description: Central State Engine, Event Emitter, and Internal Wallet System for Wishes Hub.
 */

const EventEmitter = require('events');

class PayRefundCore extends EventEmitter {
    constructor() {
        super();
        this.transactions = new Map();
        this.wallets = new Map();
        this.auditLogs = [];
        this.config = {
            defaultCurrency: 'INR',
            refundWindowHours: 24,
            bonusWalletIncentivePercent: 5.0
        };
    }

    /**
     * Initialize core engine with configuration overrides
     */
    initialize(customConfig = {}) {
        this.config = { ...this.config, ...customConfig };
        this.logEvent('SYSTEM_INITIALIZED', { config: this.config });
        return { status: 'SUCCESS', message: 'WishesPay Core Engine initialized successfully.' };
    }

    /**
     * Log internal engine events for tracking and compliance
     */
    logEvent(eventType, payload) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            eventType,
            payload
        };
        this.auditLogs.push(logEntry);
        this.emit('audit_log', logEntry);
    }

    /**
     * Get or create customer wallet balance
     */
    getWallet(userId) {
        if (!this.wallets.has(userId)) {
            this.wallets.set(userId, {
                userId,
                balance: 0.00,
                currency: this.config.defaultCurrency,
                updatedAt: new Date().toISOString()
            });
        }
        return this.wallets.get(userId);
    }

    /**
     * Credit funds to user wallet (including optional refund bonus)
     */
    creditWallet(userId, amount, isBonus = false) {
        const wallet = this.getWallet(userId);
        wallet.balance += parseFloat(amount);
        wallet.updatedAt = new Date().toISOString();
        
        this.logEvent('WALLET_CREDITED', { userId, amount, isBonus, newBalance: wallet.balance });
        this.emit('wallet_updated', wallet);
        return wallet;
    }

    /**
     * Debit funds from user wallet for purchases
     */
    debitWallet(userId, amount) {
        const wallet = this.getWallet(userId);
        const amt = parseFloat(amount);

        if (wallet.balance < amt) {
            throw new Error('Insufficient wallet balance.');
        }

        wallet.balance -= amt;
        wallet.updatedAt = new Date().toISOString();

        this.logEvent('WALLET_DEBITED', { userId, amount: amt, remainingBalance: wallet.balance });
        this.emit('wallet_updated', wallet);
        return wallet;
    }

    /**
     * Register a new transaction in the core state store
     */
    registerTransaction(transactionData) {
        const { transactionId, userId, baseAmount, taxAmount, surchargeAmount, currency } = transactionData;
        
        const totalAmount = parseFloat(baseAmount) + parseFloat(taxAmount || 0) + parseFloat(surchargeAmount || 0);

        const txRecord = {
            transactionId,
            userId,
            baseAmount: parseFloat(baseAmount),
            taxAmount: parseFloat(taxAmount || 0),
            surchargeAmount: parseFloat(surchargeAmount || 0),
            totalAmount,
            currency: currency || this.config.defaultCurrency,
            status: 'PENDING',
            createdAt: new Date().toISOString(),
            refundRequested: false
        };

        this.transactions.set(transactionId, txRecord);
        this.logEvent('TRANSACTION_REGISTERED', txRecord);
        this.emit('transaction_created', txRecord);

        return txRecord;
    }

    /**
     * Update transaction status
     */
    updateTransactionStatus(transactionId, status) {
        const tx = this.transactions.get(transactionId);
        if (!tx) {
            throw new Error(`Transaction ID ${transactionId} not found.`);
        }

        tx.status = status;
        tx.updatedAt = new Date().toISOString();
        
        this.logEvent('TRANSACTION_STATUS_UPDATED', { transactionId, status });
        this.emit('transaction_updated', tx);
        return tx;
    }
}

module.exports = new PayRefundCore();
