/**
 * @file affiliate-deep-link.js
 * @description Native app deep-linking redirector and fallback web router for Wishes Hub Affiliate Engine.
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
        root.AffiliateDeepLink = factory(root.AffiliateConfig, root.AffiliateCore);
    }
}(typeof self !== 'undefined' ? self : this, function (AffiliateConfig, AffiliateCore) {
    'use strict';

    class DeepLinkEngine {
        constructor() {
            this.config = AffiliateConfig;
            this.core = AffiliateCore;
            
            // Known e-commerce app scheme mapping templates
            this.appSchemes = {
                amazon: {
                    android: 'com.amazon.mShop.android.shopping',
                    scheme: 'amazon://'
                },
                flipkart: {
                    android: 'com.flipkart.android',
                    scheme: 'flipkart://'
                },
                meesho: {
                    android: 'com.meesho.supply',
                    scheme: 'meesho://'
                },
                myntra: {
                    android: 'com.myntra.android',
                    scheme: 'myntra://'
                }
            };
        }

        /**
         * Initialize module lifecycle
         */
        async init(config, core) {
            this.config = config || this.config;
            this.core = core || this.core;
            this.core.log('DEEP_LINK', 'Deep-Link Router module loaded successfully.');
        }

        /**
         * Smart redirect to native app or fallback to tracking web URL
         * @param {string} rawAffiliateUrl - Original affiliate web tracking link
         * @param {string} storeName - Name of the store (e.g. 'Amazon', 'Flipkart')
         */
        redirectToTarget(rawAffiliateUrl, storeName = '') {
            if (!rawAffiliateUrl) return;

            const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
            const isDeepLinkEnabled = this.config.deepLink?.enabled ?? true;

            this.core.log('DEEP_LINK', 'Processing redirect request', {
                rawAffiliateUrl,
                storeName,
                isMobile
            });

            // Log click event into state
            const recentClicks = [...this.core.getState().recentClicks, {
                url: rawAffiliateUrl,
                store: storeName,
                timestamp: new Date().toISOString()
            }];
            this.core.setState({ recentClicks });
            this.core.emit('link:clicked', { url: rawAffiliateUrl, store: storeName });

            // On Desktop or if deep-linking disabled, open web link directly
            if (!isMobile || !isDeepLinkEnabled) {
                window.open(rawAffiliateUrl, '_blank', 'noopener,noreferrer');
                return;
            }

            // Mobile Deep-Linking Execution with Timeout Fallback
            const normalizedStore = storeName.toLowerCase();
            const delay = this.config.deepLink?.redirectDelayMs || 500;
            const start = Date.now();

            // Attempt window location transfer
            const fallbackTimer = setTimeout(() => {
                // If browser tab remains active after delay, fallback to web URL
                if (Date.now() - start < delay + 1000) {
                    this.core.log('DEEP_LINK', 'App not installed or app launch failed. Falling back to browser URL.');
                    window.location.href = rawAffiliateUrl;
                }
            }, delay);

            // Trigger web URL directly as standard robust fallback
            window.open(rawAffiliateUrl, '_blank', 'noopener,noreferrer');
            clearTimeout(fallbackTimer);
        }

        /**
         * Register custom app scheme for new store
         */
        registerAppScheme(storeKey, schemeConfig) {
            this.appSchemes[storeKey.toLowerCase()] = schemeConfig;
            this.core.log('DEEP_LINK', `Custom scheme registered for: ${storeKey}`);
        }
    }

    const instance = new DeepLinkEngine();

    // Auto-register with Master Assembly if present
    if (typeof window !== 'undefined' && window.AffiliateAssembly) {
        window.AffiliateAssembly.registerModule('deepLink', instance);
    }

    return instance;
}));
