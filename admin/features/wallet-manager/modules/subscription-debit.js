export function processMonthlySubscription(wallet, planPrice) {
    if (wallet.balance >= planPrice) {
        wallet.balance -= planPrice;
        return { success: true, msg: 'Subscription auto-debited.' };
    }
    return { success: false, msg: 'Auto-debit failed: Low balance.' };
}
