export function assignABTestVariant(userId) {
    return userId.length % 2 === 0 ? 'Variant A (Optimized Grid)' : 'Variant B (Classic List)';
}
