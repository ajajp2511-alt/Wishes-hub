/**
 * @file affiliate-global-api-hub.js
 * @description Master API Hub for handling global aggregator APIs (CueLinks, Skimlinks, Admitad, etc.) and direct store APIs.
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
        root.AffiliateGlobalApiHub = factory(root.AffiliateConfig, root.AffiliateCore);
    }
}(typeof self !== 'undefined' ? self : this, function (AffiliateConfig, AffiliateCore) {
    'use strict';

    class GlobalApiHub {
        constructor() {
            this.config = AffiliateConfig;
            this.core = AffiliateCore;
            this.activeProvider = this.config.aggregator?.provider || 'cuelinks_skimlinks';
        }

        /**
         * Initialize module lifecycle
         */
        async init(config, core) {
            this.config = config || this.config;
            this.core = core || this.core;
            this.core.log('API_HUB', 'Global API Hub module loaded successfully.');
        }

        /**
         * Fetch deals from Aggregator API
         * @param {Object} queryParams - Search terms, category, or limit
         */
        async fetchDeals(queryParams = {}) {
            this.core.setState({ isLoading: true });
            this.core.log('API_HUB', 'Fetching affiliate deals...', queryParams);

            const apiKey = this.config.aggregator?.masterApiKey;
            const endpoint = `${this.config.aggregator?.baseUrl}offers`;

            try {
                // Construct query parameters
                const params = new URLSearchParams({
                    api_key: apiKey,
                    limit: queryParams.limit || this.config.maxResultsPerQuery || 20,
                    country: this.core.getState().activeCountry || 'IN',
                    ...queryParams
                });

                // Simulated API Call with fallback structure
                let responseData = [];
                if (apiKey && apiKey !== "YOUR_MASTER_API_KEY_HERE") {
                    const response = await fetch(`${endpoint}?${params.toString()}`);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    responseData = await response.json();
                } else {
                    // Fallback mock data when API key is not configured
                    this.core.log('API_HUB', 'Using mock response (No Master API Key set)');
                    responseData = this.getMockDeals();
                }

                this.core.setState({ 
                    activeDeals: responseData, 
                    isLoading: false, 
                    lastSyncTime: new Date().toISOString() 
                });

                this.core.emit('deals:fetched', responseData);
                return responseData;

            } catch (error) {
                this.core.setState({ isLoading: false });
                this.core.log('ERROR', 'Failed to fetch affiliate deals', error);
                console.error('[AffiliateGlobalApiHub] API Fetch Error:', error);
                return [];
            }
        }

        /**
         * Fallback mock deals dataset
         */
        getMockDeals() {
            return [
                {
                    id: "deal_001",
                    title: "Diwali Special Gift Box & Sweet Combo",
                    store: "Amazon IN",
                    originalPrice: 1299,
                    salePrice: 799,
                    currency: "INR",
                    discount: "38% OFF",
                    imageUrl: "https://via.placeholder.com/300x300?text=Gift+Box",
                    affiliateUrl: "https://cuelinks.com/link?id=001",
                    badge: "Best Seller"
                },
                {
                    id: "deal_002",
                    title: "Personalized Crystal Flower Vase",
                    store: "Ferns N Petals",
                    originalPrice: 1999,
                    salePrice: 1499,
                    currency: "INR",
                    discount: "25% OFF",
                    imageUrl: "https://via.placeholder.com/300x300?text=Flower+Vase",
                    affiliateUrl: "https://cuelinks.com/link?id=002",
                    badge: "Trending"
                }
            ];
        }
    }

    const instance = new GlobalApiHub();

    // Auto-register with Master Assembly if present
    if (typeof window !== 'undefined' && window.AffiliateAssembly) {
        window.AffiliateAssembly.registerModule('globalApiHub', instance);
    }

    return instance;
}));
