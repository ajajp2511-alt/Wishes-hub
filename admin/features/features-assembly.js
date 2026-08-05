console.log("⚡ features-assembly.js file triggered!");

// 1. ResponsiveAssembly ko import karein
import { ResponsiveAssembly } from '../responsive-admin.js';

export class FeaturesAssembly {
    constructor() {
        console.log("🚀 Booting Wishes Hub Admin System...");
        
        // 2. Responsive UI initialize karein
        this.initResponsiveLayout();

        // 3. System boot logic run karein
        this.bootSystem();
    }

    initResponsiveLayout() {
        try {
            new ResponsiveAssembly('dynamic-content-root');
            console.log("📱 Responsive Assembly connected successfully!");
        } catch (err) {
            console.warn("⚠️ Error initializing ResponsiveAssembly:", err.message);
        }
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

        // Relative paths update
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

// Instant Execution
new FeaturesAssembly();
