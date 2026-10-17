/**
 * @file affiliate-link-creator.js
 * @description Manual link converter and URL parser for converting raw product URLs into tracking affiliate links via Aggregator APIs.
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../affiliate-config', '../affiliate-core'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(
            require('../affiliate-config'),
            require('../affiliate-core')
        );
    } else {
        root.AffiliateLinkCreator = factory(root.AffiliateConfig, root.AffiliateCore);
    }
}(typeof self !== 'undefined' ? self : this, function (AffiliateConfig, AffiliateCore) {
    'use strict';

    class LinkCreator {
        constructor() {
            this.config = AffiliateConfig;
            this.core = AffiliateCore;
        }

        /**
         * Initialize module lifecycle
         */
        async init(config, core) {
            this.config = config || this.config;
            this.core = core || this.core;
            this.core.log('LINK_CREATOR', 'Affiliate Link Creator module loaded successfully.');
        }

        /**
         * Converts raw merchant URL into structured tracking affiliate URL
         * @param {string} rawUrl - E-commerce product URL (Amazon, Flipkart, Myntra, etc.)
         * @param {string} customSubId - Optional campaign or tracking tag ID
         */
        async convertUrl(rawUrl, customSubId = '') {
            if (!rawUrl || typeof rawUrl !== 'string') {
                throw new Error('Invalid URL provided to LinkCreator.');
            }

            this.core.log('LINK_CREATOR', 'Converting raw URL to affiliate tracking link', { rawUrl, customSubId });

            const subId = customSubId || this.config.aggregator?.defaultSubId || 'wishes_hub_global';
            const apiKey = this.config.aggregator?.masterApiKey;

            try {
                // Validate URL syntax
                const parsedUrl = new URL(rawUrl.trim());
                
                // If Aggregator API is properly configured
                if (apiKey && apiKey !== "YOUR_MASTER_API_KEY_HERE") {
                    const endpoint = `${this.config.aggregator?.baseUrl}link/create`;
                    const response = await fetch(endpoint, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${apiKey}`
                        },
                        body: JSON.stringify({
                            url: parsedUrl.href,
                            sub_id: subId
                        })
                    });

                    if (response.ok) {
                        const data = await response.json();
                        const trackingUrl = data.affiliate_url || data.url;
                        this.core.log('LINK_CREATOR', 'URL successfully converted via API', { trackingUrl });
                        return trackingUrl;
                    }
                }

                // Fallback tracking URL generator (CueLinks / Skimlinks standard redirection template)
                const encodedTarget = encodeURIComponent(parsedUrl.href);
                const fallbackAffiliateUrl = `https://links.cuelinks.com/deep_link?sub_id=${subId}&url=${encodedTarget}`;
                
                this.core.log('LINK_CREATOR', 'Generated fallback affiliate tracking link', { fallbackAffiliateUrl });
                return fallbackAffiliateUrl;

            } catch (error) {
                this.core.log('ERROR', 'Failed to convert affiliate URL', error);
                console.error('[AffiliateLinkCreator] Link Conversion Error:', error);
                return rawUrl; // Return original URL if conversion fails completely
            }
        }

        /**
         * Extract domain name from raw URL for auto-tagging
         * @param {string} rawUrl - E-commerce product link
         */
        extractDomainName(rawUrl) {
            try {
                const domain = new URL(rawUrl).hostname;
                return domain.replace('www.', '').split('.')[0];
            } catch (e) {
                return 'unknown';
            }
        }
    }

    const instance = new LinkCreator();

    // Auto-register with Master Assembly if present
    if (typeof window !== 'undefined' && window.AffiliateAssembly) {
        window.AffiliateAssembly.registerModule('linkCreator', instance);
    }

    return instance;
}));
