/**
 * @file affiliate-analytics.js
 * @description Click tracking, Sub-ID attribution, CTR metrics, and revenue analytics for Wishes Hub Affiliate Engine.
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
        root.AffiliateAnalytics = factory(root.AffiliateConfig, root.AffiliateCore);
    }
}(typeof self !== 'undefined' ? self : this, function (AffiliateConfig, AffiliateCore) {
    'use strict';

    class AnalyticsEngine {
        constructor() {
            this.config = AffiliateConfig;
            this.core = AffiliateCore;
            this.analyticsData = {
                totalClicks: 0,
                clicksByStore: {},
                clicksByCountry: {},
                recentEvents: []
            };
        }

        /**
         * Initialize module lifecycle and event listeners
         */
        async init(config, core) {
            this.config = config || this.config;
            this.core = core || this.core;

            // Subscribe to link click events from Core state bus
            this.core.on('link:clicked', (clickData) => {
                this.trackClick(clickData);
            });

            this.core.log('ANALYTICS', 'Affiliate Analytics module loaded successfully.');
        }

        /**
         * Track individual click event with attribution metadata
         * @param {Object} clickData - URL, Store Name, and Sub-ID information
         */
        trackClick(clickData = {}) {
            const currentCountry = this.core.getState().activeCountry || 'IN';
            const store = clickData.store || 'Unknown Store';

            this.analyticsData.totalClicks += 1;

            // Aggregate by Store
            this.analyticsData.clicksByStore[store] = (this.analyticsData.clicksByStore[store] || 0) + 1;

            // Aggregate by Country
            this.analyticsData.clicksByCountry[currentCountry] = (this.analyticsData.clicksByCountry[currentCountry] || 0) + 1;

            // Log detailed event record
            const eventRecord = {
                id: `clk_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
                url: clickData.url,
                store: store,
                country: currentCountry,
                currency: this.core.getState().activeCurrency,
                timestamp: new Date().toISOString()
            };

            this.analyticsData.recentEvents.unshift(eventRecord);
            if (this.analyticsData.recentEvents.length > 100) {
                this.analyticsData.recentEvents.pop(); // Memory limit guard
            }

            this.core.log('ANALYTICS', 'Click event tracked', eventRecord);
            this.core.emit('analytics:click_tracked', eventRecord);
        }

        /**
         * Retrieve aggregated summary report for Admin Dashboard
         */
        getSummaryReport() {
            return {
                totalClicks: this.analyticsData.totalClicks,
                topStores: { ...this.analyticsData.clicksByStore },
                countryBreakdown: { ...this.analyticsData.clicksByCountry },
                recentClicksCount: this.analyticsData.recentEvents.length
            };
        }

        /**
         * Export event metrics log for backend sync
         */
        getExportableLogs() {
            return [...this.analyticsData.recentEvents];
        }
    }

    const instance = new AnalyticsEngine();

    // Auto-register with Master Assembly if present
    if (typeof window !== 'undefined' && window.AffiliateAssembly) {
        window.AffiliateAssembly.registerModule('analytics', instance);
    }

    return instance;
}));
