/**
 * @file affiliate-assembly.js
 * @description Master Assembly Controller & Boot Manager for the Wishes Hub Affiliate Module.
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['./affiliate-config', './affiliate-core'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(
            require('./affiliate-config'),
            require('./affiliate-core')
        );
    } else {
        root.AffiliateAssembly = factory(root.AffiliateConfig, root.AffiliateCore);
    }
}(typeof self !== 'undefined' ? self : this, function (AffiliateConfig, AffiliateCore) {
    'use strict';

    class AssemblyManager {
        constructor() {
            this.config = AffiliateConfig;
            this.core = AffiliateCore;
            this.modules = {};
            this.isInitialized = false;
        }

        // Register Sub-Modules into Assembly
        registerModule(name, moduleInstance) {
            if (this.modules[name]) {
                console.warn(`[AffiliateAssembly] Module ${name} is already registered. Overwriting.`);
            }
            this.modules[name] = moduleInstance;
            this.core.log('ASSEMBLY', `Sub-module registered: ${name}`);
        }

        // Retrieve Registered Sub-Module
        getModule(name) {
            return this.modules[name] || null;
        }

        // Initialize Master Affiliate Engine
        async init(options = {}) {
            if (this.isInitialized) {
                console.warn('[AffiliateAssembly] Affiliate Module already initialized.');
                return;
            }

            this.core.setState({ isLoading: true });
            this.core.log('INIT', 'Initializing Affiliate Assembly System...', options);

            try {
                // Initialize modules if they expose an init lifecycle method
                for (const [name, mod] of Object.entries(this.modules)) {
                    if (mod && typeof mod.init === 'function') {
                        await mod.init(this.config, this.core);
                        this.core.log('INIT', `Sub-module initialized: ${name}`);
                    }
                }

                this.isInitialized = true;
                this.core.setState({ 
                    isLoading: false, 
                    lastSyncTime: new Date().toISOString() 
                });

                this.core.emit('assembly:ready', {
                    modulesLoaded: Object.keys(this.modules),
                    timestamp: this.core.getState().lastSyncTime
                });

            } catch (error) {
                this.core.setState({ isLoading: false });
                this.core.log('ERROR', 'Assembly initialization failed', error);
                console.error('[AffiliateAssembly] Critical initialization failure:', error);
            }
        }

        // Destroy / Reset Assembly State
        destroy() {
            for (const [name, mod] of Object.entries(this.modules)) {
                if (mod && typeof mod.destroy === 'function') {
                    mod.destroy();
                }
            }
            this.modules = {};
            this.isInitialized = false;
            this.core.log('DESTROY', 'Affiliate Assembly destroyed');
        }
    }

    const instance = new AssemblyManager();

    // Auto-boot in browser environment when DOM is ready
    if (typeof window !== 'undefined') {
        window.addEventListener('DOMContentLoaded', () => {
            instance.init();
        });
    }

    return instance;
}));
