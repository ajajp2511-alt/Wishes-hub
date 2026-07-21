/* Ads Manager Assembly */
import { AdsCore } from './ads-core.js';

export function initAdsManager() {
    const adsModule = new AdsCore();
    console.log('Ads Manager Module Loaded Successfully.');
    return adsModule;
}
