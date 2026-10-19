/**
 * Module: pay-and-refund
 * Sub-folder: tax/
 * File: tax-rate-cache.js
 * Description: Offline fallback tax rate cache engine for API downtime protection.
 */

class TaxRateCache {
    constructor() {
        this.cache = new Map();
        // Seed default fallback cache
        this.setRate('IN', { rate: 18.0, name: 'GST' });
        this.setRate('US', { rate: 8.5, name: 'Sales Tax' });
        this.setRate('GB', { rate: 20.0, name: 'VAT' });
    }

    setRate(countryCode, rateData) {
        this.cache.set(countryCode.toUpperCase(), {
            ...rateData,
            cachedAt: new Date().toISOString()
        });
    }

    getRate(countryCode) {
        const code = countryCode.toUpperCase();
        if (this.cache.has(code)) {
            return { ...this.cache.get(code), source: 'CACHE_FALLBACK' };
        }
        return { rate: 18.0, name: 'Default Tax', source: 'DEFAULT_FALLBACK' };
    }
}

module.exports = new TaxRateCache();
