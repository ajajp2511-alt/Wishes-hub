export function calculateCommissionSplit(amount) {
    const commission = (amount * 5) / 100;
    return { net: amount - commission, commission };
}
