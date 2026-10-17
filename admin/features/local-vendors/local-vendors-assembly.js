/**
 * @file local-vendors-assembly.js
 * @description Assembly Controller for Wishes Hub Local Vendor Engine.
 * Integrates onboarding, 18-feature hyper-local suite, Emotion Guard, Global Logistics Aggregator, and Payouts.
 * @module LocalVendorsAssembly
 * @version 1.0.0
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.LocalVendorsAssembly = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    class VendorsAssembly {
        constructor() {
            this.modules = {};
            this.isInitialized = false;
            this.version = "1.0.0";
        }

        /**
         * Register individual sub-modules into the assembly
         * @param {string} name - Module identifier key
         * @param {object} instance - Module instance object
         */
        registerModule(name, instance) {
            if (this.modules[name]) {
                console.warn(`[LocalVendorsAssembly] Warning: Module ${name} is being overwritten.`);
            }
            this.modules[name] = instance;
            console.log(`[LocalVendorsAssembly] Registered sub-module: [${name}]`);
        }

        /**
         * Initialize all registered local vendor modules in sequence
         * @param {object} customConfig - Optional runtime configuration overrides
         */
        async init(customConfig = {}) {
            if (this.isInitialized) {
                console.warn('[LocalVendorsAssembly] Assembly is already initialized.');
                return this;
            }

            console.log('[LocalVendorsAssembly] Starting initialization of Local Vendor Engine...');

            try {
                // 1. Initialize Core State & Event Bus
                if (this.modules.core && typeof this.modules.core.init === 'function') {
                    await this.modules.core.init(customConfig);
                }

                // 2. Initialize Vendor Onboarding Engine (5-Step Form & T&C)
                if (this.modules.onboarding && typeof this.modules.onboarding.init === 'function') {
                    await this.modules.onboarding.init();
                }

                // 3. Initialize Order Routing & 15-Min Auto-Reroute Engine
                if (this.modules.routing && typeof this.modules.routing.init === 'function') {
                    await this.modules.routing.init();
                }

                // 4. Initialize Emotion Guard & 12 AM Midnight Scheduler
                if (this.modules.emotionGuard && typeof this.modules.emotionGuard.init === 'function') {
                    await this.modules.emotionGuard.init();
                }

                // 5. Initialize Global Logistics Aggregator API Hub
                if (this.modules.aggregator && typeof this.modules.aggregator.init === 'function') {
                    await this.modules.aggregator.init();
                }

                // 6. Initialize Payouts & Commission Split Controller
                if (this.modules.payouts && typeof this.modules.payouts.init === 'function') {
                    await this.modules.payouts.init();
                }

                this.isInitialized = true;
                console.log('[LocalVendorsAssembly] Local Vendor Engine fully assembled and operational.');
                return this;

            } catch (error) {
                console.error('[LocalVendorsAssembly] Initialization error:', error);
                throw error;
            }
        }

        /**
         * Retrieve a specific registered module
         * @param {string} name - Module identifier
         */
        getModule(name) {
            return this.modules[name] || null;
        }

        /**
         * Get current system status report
         */
        getStatus() {
            return {
                isInitialized: this.isInitialized,
                version: this.version,
                loadedModules: Object.keys(this.modules)
            };
        }
    }

    const assemblyInstance = new VendorsAssembly();

    // Attach to global window if running in browser
    if (typeof window !== 'undefined') {
        window.LocalVendorsAssembly = assemblyInstance;
    }

    return assemblyInstance;
}));
