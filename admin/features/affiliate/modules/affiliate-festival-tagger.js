/**
 * @file affiliate-festival-tagger.js
 * @description Automated festival, occasion, and wish-based deal matching engine for Wishes Hub Affiliate Module.
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../affiliate-config', '../affiliate-core', './affiliate-global-api-hub'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(
            require('../affiliate-config'),
            require('../affiliate-core'),
            require('./affiliate-global-api-hub')
        );
    } else {
        root.AffiliateFestivalTagger = factory(
            root.AffiliateConfig,
            root.AffiliateCore,
            root.AffiliateGlobalApiHub
        );
    }
}(typeof self !== 'undefined' ? self : this, function (AffiliateConfig, AffiliateCore, AffiliateGlobalApiHub) {
    'use strict';

    class FestivalTagger {
        constructor() {
            this.config = AffiliateConfig;
            this.core = AffiliateCore;
            this.apiHub = AffiliateGlobalApiHub;

            // Keyword mapping for automated festival/wish matching
            this.festivalKeywords = {
                diwali: ['diwali', 'deepawali', 'crackers', 'sweets', 'gift box', 'puja', 'diya', 'lights'],
                christmas: ['christmas', 'xmas', 'santa', 'tree', 'gift hamper', 'winter', 'party'],
                valentine: ['valentine', 'rose', 'chocolate', 'teddy', 'love', 'couple', 'gift'],
                birthday: ['birthday', 'cake', 'party', 'balloon', 'candle', 'gift', 'celebration'],
                anniversary: ['anniversary', 'ring', 'watch', 'couple', 'flowers', 'romantic']
            };
        }

        /**
         * Initialize module lifecycle
         */
        async init(config, core) {
            this.config = config || this.config;
            this.core = core || this.core;
            this.core.log('FESTIVAL_TAGGER', 'Festival Tagger module loaded successfully.');
        }

        /**
         * Match deals based on a specific wish occasion or festival tag
         * @param {string} occasion - e.g., 'diwali', 'birthday', 'valentine'
         */
        async fetchDealsByOccasion(occasion) {
            const normalizedOccasion = (occasion || '').toLowerCase().trim();
            this.core.log('FESTIVAL_TAGGER', `Fetching deals matched for occasion: ${normalizedOccasion}`);

            const keywords = this.festivalKeywords[normalizedOccasion] || [normalizedOccasion];
            const queryTerm = keywords[0] || 'gift';

            // Fetch deals from API Hub matching the occasion query
            const deals = await this.apiHub.fetchDeals({ query: queryTerm, occasion: normalizedOccasion });
            
            this.core.emit('festival:deals_matched', { occasion: normalizedOccasion, count: deals.length });
            return deals;
        }

        /**
         * Auto-tag a deal object with detected occasion
         * @param {Object} deal - Deal item
         */
        detectOccasionFromDeal(deal) {
            const textContent = `${deal.title || ''} ${deal.category || ''}`.toLowerCase();
            
            for (const [festival, keywords] of Object.entries(this.festivalKeywords)) {
                for (const kw of keywords) {
                    if (textContent.includes(kw)) {
                        return festival;
                    }
                }
            }
            return 'general';
        }
    }

    const instance = new FestivalTagger();

    // Auto-register with Master Assembly if present
    if (typeof window !== 'undefined' && window.AffiliateAssembly) {
        window.AffiliateAssembly.registerModule('festivalTagger', instance);
    }

    return instance;
}));
