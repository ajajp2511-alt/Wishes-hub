export function calculateSlaCredit(outageHours) {
    return outageHours > 2 ? 'Compensated with 50 Wallet Reward Points' : 'No compensation required';
}
