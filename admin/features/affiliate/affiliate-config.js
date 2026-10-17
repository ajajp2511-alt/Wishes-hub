/**
 * @file affiliate-config.js
 * @description Configuration settings, Master Aggregator API keys, and global parameters for the Wishes Hub Affiliate Engine.
 */

const AffiliateConfig = {
    // Platform Details
    platformName: "Wishes Hub",
    version: "1.0.0",
    
    // Aggregator Network Settings (e.g., CueLinks / Skimlinks Master API Integration)
    aggregator: {
        provider: "cuelinks_skimlinks", // Can be 'cuelinks', 'skimlinks', or 'admitad'
        masterApiKey: process.env.AFFILIATE_MASTER_API_KEY || "YOUR_MASTER_API_KEY_HERE",
        baseUrl: "https://api.cuelinks.com/v2/", // Example endpoint
        defaultSubId: "wishes_hub_global"
    },

    // Supported Regions & Currencies
    localization: {
        defaultCurrency: "INR",
        defaultCountry: "IN",
        supportedCurrencies: ["INR", "USD", "EUR", "GBP", "AED"],
        autoDetectIp: true
    },

    // Deep-Link & Redirection Settings
    deepLink: {
        enabled: true,
        fallbackToWeb: true,
        redirectDelayMs: 500
    },

    // Cache & Limits
    cacheTTL: 3600, // 1 hour in seconds
    maxResultsPerQuery: 20
};

// Export configuration for assembly controller
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AffiliateConfig;
} else {
    window.AffiliateConfig = AffiliateConfig;
}
