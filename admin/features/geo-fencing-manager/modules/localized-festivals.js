export function getFestivalBanner(countryCode) {
    if (countryCode === 'IN') return 'Diwali Festive Sparkle (5% Bonus)';
    if (countryCode === 'US') return 'Holiday Celebration Pass';
    return 'Standard Global Experience';
}
