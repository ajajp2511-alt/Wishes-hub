export function calculateGeoPricing(baseInr, currency) {
    const rates = { 'INR': 1, 'USD': 0.012, 'EUR': 0.011, 'GBP': 0.0095, 'CNY': 0.086 };
    return (baseInr * (rates[currency] || 1)).toFixed(2);
}
