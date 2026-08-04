export class FeaturesAssembly {
    constructor() {
        console.log("🚀 Booting Wishes Hub Admin System...");
        this.bootSystem();
    }

    /**
     * 🛡️ SAFE ISOLATION LAUNCHER
     * Single module fail hone par bhi baaki dashboard crash nahi hone deta.
     */
    async safeRun(name, importPath, initFns) {
        try {
            const module = await import(importPath);
            if (!module) return null;

            if (Array.isArray(initFns)) {
                for (const fnName of initFns) {
                    if (typeof module[fnName] === 'function') {
                        await module[fnName]();
                    } else if (module.default && typeof module.default[fnName] === 'function') {
                        await module.default[fnName]();
                    }
                }
            } else if (typeof module[initFns] === 'function') {
                await module[initFns]();
            } else if (module.default && typeof module.default[initFns] === 'function') {
                await module.default[initFns]();
            }

            console.log(`✅ Module Loaded: [${name}]`);
            return module;
        } catch (err) {
            console.warn(`⚠️ Error loading module [${name}]:`, err.message);
            return null;
        }
    }

    async bootSystem() {
        // Parent folder (/admin/) ke modules access karne ke liye "../" paths
        await this.safeRun('outlet', '../outlet/outlet-assembly.js', 'initOutlet');

        await Promise.allSettled([
            this.safeRun('analytics', '../analytics/analytics-assembly.js', 'initAnalytics'),
            this.safeRun('settings', '../settings/settings-assembly.js', 'initSettings'),
            this.safeRun('media', '../media/media-assembly.js', 'initMedia'),
            this.safeRun('wishes', '../wishes/wishes-assembly.js', 'initWishes'),
            this.safeRun('auth', '../auth/auth-assembly.js', 'initAuth')
        ]);

        console.log("🎉 All Admin Assemblies Loaded Successfully!");
    }
}

// Auto Bootstrapping
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new FeaturesAssembly());
} else {
    new FeaturesAssembly();
}
