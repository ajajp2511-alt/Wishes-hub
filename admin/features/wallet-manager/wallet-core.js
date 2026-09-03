import { WALLET_CONFIG } from './wallet-config.js';

export class WalletCore {
    constructor() {
        // Master Transaction Ledger synced with Google Sheets mock
        this.transactionLedger = [
            { id: 'TXN-9001', timestamp: '2026-09-02 11:20', userEmail: 'aarav@example.com', type: 'Credit (Top-Up)', amount: 2500, currency: 'INR', gateway: 'Razorpay', status: 'Success', wishId: '-' },
            { id: 'TXN-9002', timestamp: '2026-09-02 14:45', userEmail: 'priya@example.com', type: 'Money Wish Sent', amount: 500, currency: 'INR', gateway: 'Internal Wallet', status: 'Escrow', wishId: 'WISH-501' },
            { id: 'TXN-9003', timestamp: '2026-09-03 09:10', userEmail: 'rohit@example.com', type: 'Withdrawal Request', amount: 1200, currency: 'INR', gateway: 'UPI', status: 'Pending', wishId: '-' }
        ];

        this.wallets = [
            { email: 'aarav@example.com', name: 'Aarav Sharma', balance: 4850, rewardPoints: 340, tier: 'Silver', currency: 'INR', autoDebitSub: true },
            { email: 'priya@example.com', name: 'Priya Verma', balance: 12400, rewardPoints: 1250, tier: 'Gold', currency: 'INR', autoDebitSub: false },
            { email: 'rohit@example.com', name: 'Rohit Gupta', balance: 650, rewardPoints: 80, tier: 'Bronze', currency: 'INR', autoDebitSub: true }
        ];

        this.vouchers = [
            { code: 'WISHFEST500', amount: 500, status: 'Active', usedBy: null }
        ];

        this.moneyWishesActive = [
            { wishId: 'WISH-501', sender: 'priya@example.com', recipient: 'aarav@example.com', amount: 500, status: 'Locked (Unlocks 12:00 AM)', isAnonymous: false, note: 'Happy Birthday Aarav!', audioNoteUrl: null, pooledFrom: [] }
        ];
    }

    getLedger() {
        return this.transactionLedger;
    }

    getWallets() {
        return this.wallets;
    }

    getMoneyWishes() {
        return this.moneyWishesActive;
    }

    syncToGoogleSheets(txn) {
        // Mock Google Sheets synchronization
        this.transactionLedger.unshift(txn);
        console.log(`[Google Sheets API Sync] Appended transaction ${txn.id} to sheet row.`);
    }

    processTopUp(email, amount, gateway) {
        const userWallet = this.wallets.find(w => w.email === email);
        if (!userWallet) return false;

        userWallet.balance += Number(amount);
        const txnId = `TXN-${Math.floor(1000 + Math.random() * 9000)}`;
        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);

        const newTxn = {
            id: txnId,
            timestamp,
            userEmail: email,
            type: 'Credit (Top-Up)',
            amount: Number(amount),
            currency: userWallet.currency,
            gateway,
            status: 'Success',
            wishId: '-'
        };

        this.syncToGoogleSheets(newTxn);
        return true;
    }

    sendMoneyWish(senderEmail, recipientEmail, amount, note, isAnonymous, isLocked, audioAttached) {
        const senderWallet = this.wallets.find(w => w.email === senderEmail);
        if (!senderWallet || senderWallet.balance < amount) return { success: false, message: 'Insufficient balance!' };

        // Deduct from sender
        senderWallet.balance -= Number(amount);

        // Apply Platform Commission Split (5%)
        const commission = (amount * WALLET_CONFIG.PLATFORM_COMMISSION_PERCENT) / 100;
        const netRecipientAmount = amount - commission;

        const wishId = `WISH-${Math.floor(100 + Math.random() * 900)}`;
        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);

        this.moneyWishesActive.push({
            wishId,
            sender: isAnonymous ? 'Anonymous' : senderEmail,
            recipient: recipientEmail,
            amount: netRecipientAmount,
            status: isLocked ? 'Locked (Scheduled)' : 'Escrow (Holding)',
            isAnonymous,
            note,
            audioNoteUrl: audioAttached ? 'audio-sample.mp3' : null,
            pooledFrom: []
        });

        // Log to Ledger / Google Sheets
        const newTxn = {
            id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
            timestamp,
            userEmail: senderEmail,
            type: 'Money Wish Sent (Escrow)',
            amount: Number(amount),
            currency: 'INR',
            gateway: 'Internal Wallet',
            status: 'Escrow',
            wishId
        };
        this.syncToGoogleSheets(newTxn);

        // Gamified Spin & Win reward bonus trigger
        senderWallet.rewardPoints += 50;

        return { success: true, wishId, netAmount: netRecipientAmount };
    }

    processWithdrawal(email, amount, payoutMethod) {
        const userWallet = this.wallets.find(w => w.email === email);
        if (!userWallet || userWallet.balance < amount) return false;

        userWallet.balance -= Number(amount);
        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);

        const newTxn = {
            id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
            timestamp,
            userEmail: email,
            type: 'Withdrawal Request',
            amount: Number(amount),
            currency: userWallet.currency,
            gateway: payoutMethod,
            status: 'Pending',
            wishId: '-'
        };

        this.syncToGoogleSheets(newTxn);
        return true;
    }

    adminManualAdjustment(email, adjustmentType, amount, reason) {
        const userWallet = this.wallets.find(w => w.email === email);
        if (!userWallet) return false;

        if (adjustmentType === 'Credit') {
            userWallet.balance += Number(amount);
        } else {
            userWallet.balance -= Number(amount);
        }

        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
        const newTxn = {
            id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
            timestamp,
            userEmail: email,
            type: `Admin Manual (${adjustmentType}): ${reason}`,
            amount: Number(amount),
            currency: userWallet.currency,
            gateway: 'Admin Override',
            status: 'Success',
            wishId: '-'
        };

        this.syncToGoogleSheets(newTxn);
        return true;
    }
    }
