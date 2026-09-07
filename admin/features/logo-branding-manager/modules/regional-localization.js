export function getLocalizedBrandingScript(regionCode) {
    if (regionCode === 'JP') return 'Wishes Hub (ウィッシュハブ)';
    if (regionCode === 'AR') return 'Wishes Hub (مركز الأمنيات)';
    return 'Wishes Hub';
}
