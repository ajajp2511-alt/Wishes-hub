console.log("⚡ features-assembly.js initialized with Lazy-Router & AI Engine!");

export class FeaturesAssembly {
  constructor() {
    console.log("🚀 Booting Dynamic System Architecture...");
    this.root = document.getElementById('dynamic-content-root');
    this.loadedModules = new Map();
    this.bootSystem();
  }

  // 1. Feature Dynamic Path Registry Map (On-Demand Loading)
  featureRegistry = {
    'create-wish': { path: '/admin/features/create-wish/create-wish-assembly.js', initFn: 'init' },
    'google-sheets-dashboard': { path: '/admin/features/google-sheets/sheets-assembly.js', initFn: 'initGoogleSheets' },
    'ab-testing': { path: '/admin/features/ab-testing/ab-assembly.js', initFn: 'init' },
    'ai-automation': { path: '/admin/features/ai-automation/ai-assembly.js', initFn: 'init' },
    'analytics': { path: '/admin/features/analytics/analytics-assembly.js', initFn: 'init' },
    'app-pwa-manager': { path: '/admin/features/app-pwa-manager/pwa-assembly.js', initFn: 'init' },
    'assets': { path: '/admin/features/assets/assets-assembly.js', initFn: 'init' },
    'auth-security': { path: '/admin/features/auth-security/auth-assembly.js', initFn: 'init' },
    'community-feedback': { path: '/admin/features/community-feedback/community-assembly.js', initFn: 'init' },
    'campaigns-marketing': { path: '/admin/features/campaigns-marketing/marketing-assembly.js', initFn: 'init' },
    'compliance': { path: '/admin/features/compliance/compliance-assembly.js', initFn: 'init' },
    'content-templates': { path: '/admin/features/content-templates/content-assembly.js', initFn: 'init' },
    'feature-flags-staging': { path: '/admin/features/feature-flags-staging/feature-flags-assembly.js', initFn: 'init' },
    'gamification-rewards': { path: '/admin/features/gamification-rewards/gamification-assembly.js', initFn: 'init' },
    'health-monitor': { path: '/admin/features/health-monitor/health-assembly.js', initFn: 'init' },
    'integrations': { path: '/admin/features/integrations/integration-assembly.js', initFn: 'init' },
    'link-manager': { path: '/admin/features/link-manager/link-assembly.js', initFn: 'init' },
    'localization': { path: '/admin/features/localization/loc-assembly.js', initFn: 'init' },
    'manage-wish': { path: '/admin/features/manage-wish/manage-wish-assembly.js', initFn: 'init' },
    'marketplace-creators': { path: '/admin/features/marketplace-creators/marketplace-assembly.js', initFn: 'init' },
    'media-manager': { path: '/admin/features/media-manager/media-assembly.js', initFn: 'init' },
    'monetization': { path: '/admin/features/monetization/monetization-assembly.js', initFn: 'init' },
    'notifications': { path: '/admin/features/notifications/notifications-assembly.js', initFn: 'init' },
    'performance-cache': { path: '/admin/features/performance-cache/performance-assembly.js', initFn: 'init' },
    'price-plans': { path: '/admin/features/price-plans/pricing-assembly.js', initFn: 'init' },
    'reports': { path: '/admin/features/reports/reports-assembly.js', initFn: 'init' },
    'responsive-layout': { path: '/admin/features/responsive-layout/responsive-assembly.js', initFn: 'init' },
    'security-shield': { path: '/admin/features/security-shield/security-assembly.js', initFn: 'init' },
    'seo': { path: '/admin/features/seo/seo-assembly.js', initFn: 'init' },
    'settings': { path: '/admin/features/settings/settings-assembly.js', initFn: 'init' },
    'share-manager': { path: '/admin/features/share-manager/share-assembly.js', initFn: 'init' },
    'system-logs': { path: '/admin/features/system-logs/logs-assembly.js', initFn: 'init' },
    'trending': { path: '/admin/features/trending/trending-assembly.js', initFn: 'init' },
    'users-crm': { path: '/admin/features/users-crm/users-assembly.js', initFn: 'init' },
    'worker-analytics': { path: '/admin/features/worker-analytics/worker-assembly.js', initFn: 'init' }
  };

  async safeRun(name, importPath, initFn) {
    try {
      let module = this.loadedModules.get(name);
      if (!module) {
        module = await import(importPath);
        this.loadedModules.set(name, module);
      }

      if (module) {
        if (typeof module[initFn] === 'function') {
          await module[initFn]();
        } else if (module.default && typeof module.default[initFn] === 'function') {
          await module.default[initFn]();
        } else if (typeof module.init === 'function') {
          await module.init();
        }
      }

      console.log(`✅ Dynamically Executed Feature: [${name}]`);
      return module;
    } catch (err) {
      console.warn(`⚠️ Error executing feature [${name}]:`, err.message);
      return null;
    }
  }

  async bootSystem() {
    // Basic Welcome Screen Set up
    if (this.root) {
      this.root.innerHTML = `
        <div style="padding: 20px;">
          <h2 style="margin-bottom: 10px;">Welcome to Wishes Hub Admin</h2>
          <p>Dashboard is live and listening for feature clicks...</p>
        </div>
      `;
    }

    // ⚡ ALWAYS RUN 1: Navigation Menu Core Boot (User interaction ke liye)
    await this.safeRun('menu', '/admin/features/menu-navigation/menu-assembly.js', 'initMenu');

    // ⚡ ALWAYS RUN 2: Background AI Event & Wish Engine (Background me silently active)
    this.startBackgroundAIEngine();

    // ⚡ TAP LISTENER: Menu item tap handle karna
    document.addEventListener('menu-navigate', (e) => {
      const subId = e.detail?.subId;
      if (subId) {
        this.loadFeatureOnTap(subId);
      }
    });
  }

  // Background AI System Workflow
  async startBackgroundAIEngine() {
    try {
      const aiModule = await import('/admin/features/ai-automation/ai-assembly.js');
      if (aiModule && typeof aiModule.startBackgroundAutoWishEngine === 'function') {
        aiModule.startBackgroundAutoWishEngine();
        console.log("🤖 AI Auto-Event & Wish Generator running silently in background!");
      }
    } catch (err) {
      console.log("ℹ️ AI Engine background runner setup ready for configuration.");
    }
  }

  // User Click Handler (Single Feature Loading)
  async loadFeatureOnTap(subId) {
    const config = this.featureRegistry[subId];

    if (!config) {
      if (this.root) {
        this.root.innerHTML = `
          <div style="padding: 20px;">
            <h2>${subId}</h2>
            <p>Module mapped and ready for development.</p>
          </div>
        `;
      }
      return;
    }

    if (this.root) {
      this.root.innerHTML = `<div style="padding: 20px;"><p>Loading module...</p></div>`;
    }

    // Clear dynamic UI container and load ONLY clicked module
    await this.safeRun(subId, config.path, config.initFn);
  }
}

new FeaturesAssembly();
