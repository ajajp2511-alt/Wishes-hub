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

        // A/B Testing module
        await this.safeRun('ab-testing', '/admin/features/ab-testing/ab-assembly.js', 'init');

        // AI Automation module
        await this.safeRun('ai-automation', '/admin/features/ai-automation/ai-assembly.js', 'init');

        // Analytics module
        await this.safeRun('analytics', '/admin/features/analytics/analytics-assembly.js', 'init');

        // App & PWA Manager module
        await this.safeRun('app-pwa-manager', '/admin/features/app-pwa-manager/pwa-assembly.js', 'init');

        // Assets module
        await this.safeRun('assets', '/admin/features/assets/assets-assembly.js', 'init');

        // Auth & Security module
        await this.safeRun('auth-security', '/admin/features/auth-security/auth-assembly.js', 'init');

        // Community Feedback module
        await this.safeRun('community-feedback', '/admin/features/community-feedback/community-assembly.js', 'init');

        // Campaigns & Marketing module
        await this.safeRun('campaigns-marketing', '/admin/features/campaigns-marketing/marketing-assembly.js', 'init');

        // Compliance module
        await this.safeRun('compliance', '/admin/features/compliance/compliance-assembly.js', 'init');

        // Content Templates module
        await this.safeRun('content-templates', '/admin/features/content-templates/content-assembly.js', 'init');

        // Feature Flags Staging module
        await this.safeRun('feature-flags-staging', '/admin/features/feature-flags-staging/feature-flags-assembly.js', 'init');

        // Gamification Rewards module
        await this.safeRun('gamification-rewards', '/admin/features/gamification-rewards/gamification-assembly.js', 'init');

        // Health Monitor module
        await this.safeRun('health-monitor', '/admin/features/health-monitor/health-assembly.js', 'init');

        // Integrations module
        await this.safeRun('integrations', '/admin/features/integrations/integration-assembly.js', 'init');

        // Link Manager module
        await this.safeRun('link-manager', '/admin/features/link-manager/link-assembly.js', 'init');

        // Localization module
        await this.safeRun('localization', '/admin/features/localization/loc-assembly.js', 'init');

        // Manage Wish module
        await this.safeRun('manage-wish', '/admin/features/manage-wish/manage-wish-assembly.js', 'init');

        // Marketplace Creators module
        await this.safeRun('marketplace-creators', '/admin/features/marketplace-creators/marketplace-assembly.js', 'init');

        // Media Manager module
        await this.safeRun('media-manager', '/admin/features/media-manager/media-assembly.js', 'init');

        // Monetization module
        await this.safeRun('monetization', '/admin/features/monetization/monetization-assembly.js', 'init');

        // Notifications module
        await this.safeRun('notifications', '/admin/features/notifications/notifications-assembly.js', 'init');

        // Performance Cache module
        await this.safeRun('performance-cache', '/admin/features/performance-cache/performance-assembly.js', 'init');

        // Price Plans module
        await this.safeRun('price-plans', '/admin/features/price-plans/pricing-assembly.js', 'init');

        // Reports module
        await this.safeRun('reports', '/admin/features/reports/reports-assembly.js', 'init');

        // Responsive Layout module
        await this.safeRun('responsive-layout', '/admin/features/responsive-layout/responsive-assembly.js', 'init');

        // Security Shield module
        await this.safeRun('security-shield', '/admin/features/security-shield/security-assembly.js', 'init');

        // SEO module
        await this.safeRun('seo', '/admin/features/seo/seo-assembly.js', 'init');

        // Settings module
        await this.safeRun('settings', '/admin/features/settings/settings-assembly.js', 'init');

        // Share Manager module
        await this.safeRun('share-manager', '/admin/features/share-manager/share-assembly.js', 'init');

        // System Logs module
        await this.safeRun('system-logs', '/admin/features/system-logs/logs-assembly.js', 'init');

        // Trending module
        await this.safeRun('trending', '/admin/features/trending/trending-assembly.js', 'init');

        // Users CRM module
        await this.safeRun('users-crm', '/admin/features/users-crm/users-assembly.js', 'init');

        // Worker Analytics module
        await this.safeRun('worker-analytics', '/admin/features/worker-analytics/worker-assembly.js', 'init');
    }
}

new FeaturesAssembly();
