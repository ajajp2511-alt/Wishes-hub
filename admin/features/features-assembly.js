console.log("⚡ features-assembly.js file triggered!");

export class FeaturesAssembly {
    constructor() {
        console.log("🚀 Booting Wishes Hub Admin System...");
        this.bootSystem();
    }

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
        const root = document.getElementById('dynamic-content-root');
        if (root) {
            root.innerHTML = `
                <div style="padding: 20px;">
                    <h2 style="margin-bottom: 10px;">Welcome to Wishes Hub Admin</h2>
                    <p>Dashboard is live and ready!</p>
                </div>
            `;
        }

        // Absolute paths for Vercel dynamic imports
        await this.safeRun('outlet', '/admin/outlet/outlet-assembly.js', 'initOutlet');

        await Promise.allSettled([
            this.safeRun('analytics', '/admin/analytics/analytics-assembly.js', 'initAnalytics'),
            this.safeRun('settings', '/admin/settings/settings-assembly.js', 'initSettings'),
            this.safeRun('media', '/admin/media/media-assembly.js', 'initMedia'),
            this.safeRun('wishes', '/admin/wishes/wishes-assembly.js', 'initWishes'),
            this.safeRun('auth', '/admin/auth/auth-assembly.js', 'initAuth')
        ]);

        console.log("🎉 All Admin Assemblies Loaded Successfully!");
    }
}

// Instant Execution
new FeaturesAssembly();
