/**
 * @file local-vendors-config.js
 * @description Global Configuration and Constants for Local Vendor Engine
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.LocalVendorsConfig = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    return {
        MODULE_NAME: 'LocalVendorEngine',
        VERSION: '1.0.0',
        DEFAULT_RADIUS_KM: 5,
        MAX_RADIUS_KM: 10,
        ACCEPTANCE_TIMEOUT_MS: 15 * 60 * 1000, // 15 Minutes
        EMOTION_GUARD_CHECK_HOUR: 22,          // 10 PM WhatsApp Check
        ADMIN_COMMISSION_PERCENT: 10,          // 10% Platform Margin
        GLOBAL_AGGREGATOR_ENABLED: true,
        SUPPORTED_CURRENCIES: ['INR', 'USD', 'EUR'],
        ROUTING_TIERS: {
            LOCAL_VENDOR: 'TIER_1_LOCAL_VENDOR',
            GLOBAL_AGGREGATOR: 'TIER_2_GLOBAL_AGGREGATOR',
            CENTRAL_HUB: 'TIER_3_CENTRAL_DARK_STORE'
        }
    };
}));
