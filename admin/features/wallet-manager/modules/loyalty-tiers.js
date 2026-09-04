export function calculateTier(spentAmount) {
    if (spentAmount >= 50000) return 'Platinum';
    if (spentAmount >= 20000) return 'Gold';
    if (spentAmount >= 5000) return 'Silver';
    return 'Bronze';
}
