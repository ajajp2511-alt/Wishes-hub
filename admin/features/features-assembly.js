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

            console.log(`✅ Loaded feature: [${name}]`);
            return module;
        } catch (err) {
            console.warn(`⚠️ Error executing feature [${name}]:`, err.message);
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

        // Outlet module
        await this.safeRun('outlet', '/admin/features/outlet/outlet-assembly.js', 'initOutlet');

        // Menu Navigation module
        await this.safeRun('menu', '/admin/features/menu-navigation/menu-assembly.js', 'initMenu');

        // Google Sheets module
        await this.safeRun('google-sheets', '/admin/features/google-sheets/sheets-assembly.js', 'initGoogleSheets');

        // Create Wish module
        await this.safeRun('create-wish', '/admin/features/create-wish/create-wish-assembly.js', 'init');
    }
}

new FeaturesAssembly();
