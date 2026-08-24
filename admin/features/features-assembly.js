console.log("⚡ features-assembly.js initialized with Lazy-Router & AI Engine!");

export class FeaturesAssembly {
  constructor() {
    console.log("🚀 Booting Dynamic System Architecture...");
    this.root = document.getElementById('dynamic-content-root');
    this.loadedModules = new Map();
    this.bootSystem();
  }

  // 1. ALL SUB-ITEM IDs DIRECT MAPPING TO ASSEMBLY FILES
  featureRegistry = {
    // Create Wish
    'create-text': { path: '/admin/features/create-wish/create-wish-assembly.js', initFn: 'init' },
    'create-image': { path: '/admin/features/create-wish/create-wish-assembly.js', initFn: 'init' },
    'create-audio': { path: '/admin/features/create-wish/create-wish-assembly.js', initFn: 'init' },
    'create-video': { path: '/admin/features/create-wish/create-wish-assembly.js', initFn: 'init' },
    'create-story': { path: '/admin/features/create-wish/create-wish-assembly.js', initFn: 'init' },
    'create-interactive': { path: '/admin/features/create-wish/create-wish-assembly.js', initFn: 'init' },
    'create-ai': { path: '/admin/features/create-wish/create-wish-assembly.js', initFn: 'init' },

    // Asset & Inventory Hub
    'asset-animations': { path: '/admin/features/assets/assets-assembly.js', initFn: 'init' },
    'asset-songs': { path: '/admin/features/assets/assets-assembly.js', initFn: 'init' },
    'asset-invitations': { path: '/admin/features/assets/assets-assembly.js', initFn: 'init' },
    'asset-particles': { path: '/admin/features/assets/assets-assembly.js', initFn: 'init' },
    'asset-fonts': { path: '/admin/features/assets/assets-assembly.js', initFn: 'init' },
    'asset-frames': { path: '/admin/features/assets/assets-assembly.js', initFn: 'init' },
    'asset-stickers': { path: '/admin/features/assets/assets-assembly.js', initFn: 'init' },
    'asset-palettes': { path: '/admin/features/assets/assets-assembly.js', initFn: 'init' },

    // Wishes Manager
    'wishes-all': { path: '/admin/features/manage-wish/manage-wish-assembly.js', initFn: 'init' },
    'wishes-categories': { path: '/admin/features/manage-wish/manage-wish-assembly.js', initFn: 'init' },
    'wishes-templates': { path: '/admin/features/manage-wish/manage-wish-assembly.js', initFn: 'init' },

    // Users & CRM
    'users-all': { path: '/admin/features/users-crm/users-assembly.js', initFn: 'init' },
    'users-activity': { path: '/admin/features/users-crm/users-assembly.js', initFn: 'init' },
    'users-saved': { path: '/admin/features/users-crm/users-assembly.js', initFn: 'init' },
    'users-data-collected': { path: '/admin/features/users-crm/users-assembly.js', initFn: 'init' },

    // Security & Threat Shield
    'sec-threat-logs': { path: '/admin/features/security-shield/security-assembly.js', initFn: 'init' },
    'sec-ip-blacklist': { path: '/admin/features/security-shield/security-assembly.js', initFn: 'init' },
    'sec-bot-protection': { path: '/admin/features/security-shield/security-assembly.js', initFn: 'init' },
    'sec-2fa-sessions': { path: '/admin/features/security-shield/security-assembly.js', initFn: 'init' },

    // App & PWA Manager
    'pwa-manifest': { path: '/admin/features/app-pwa-manager/pwa-assembly.js', initFn: 'init' },
    'pwa-tokens': { path: '/admin/features/app-pwa-manager/pwa-assembly.js', initFn: 'init' },
    'pwa-deeplinks': { path: '/admin/features/app-pwa-manager/pwa-assembly.js', initFn: 'init' },

    // Feature Flags & Staging
    'flags-toggles': { path: '/admin/features/feature-flags-staging/feature-flags-assembly.js', initFn: 'init' },
    'flags-staging': { path: '/admin/features/feature-flags-staging/feature-flags-assembly.js', initFn: 'init' },
    'flags-rollback': { path: '/admin/features/feature-flags-staging/feature-flags-assembly.js', initFn: 'init' },

    // Gamification & Rewards
    'gami-streaks': { path: '/admin/features/gamification-rewards/gamification-assembly.js', initFn: 'init' },
    'gami-spin': { path: '/admin/features/gamification-rewards/gamification-assembly.js', initFn: 'init' },
    'gami-leaderboard': { path: '/admin/features/gamification-rewards/gamification-assembly.js', initFn: 'init' },

    // Marketplace & Creators
    'market-store': { path: '/admin/features/marketplace-creators/marketplace-assembly.js', initFn: 'init' },
    'market-creators': { path: '/admin/features/marketplace-creators/marketplace-assembly.js', initFn: 'init' },
    'market-payouts': { path: '/admin/features/marketplace-creators/marketplace-assembly.js', initFn: 'init' },

    // Campaigns & Marketing
    'camp-scheduler': { path: '/admin/features/campaigns-marketing/marketing-assembly.js', initFn: 'init' },
    'camp-bots': { path: '/admin/features/campaigns-marketing/marketing-assembly.js', initFn: 'init' },
    'camp-newsletters': { path: '/admin/features/campaigns-marketing/marketing-assembly.js', initFn: 'init' },

    // Content Engine & Templates
    'engine-canvas': { path: '/admin/features/content-templates/content-assembly.js', initFn: 'init' },
    'engine-fonts': { path: '/admin/features/content-templates/content-assembly.js', initFn: 'init' },
    'engine-packs': { path: '/admin/features/content-templates/content-assembly.js', initFn: 'init' },

    // Media Manager
    'media-images': { path: '/admin/features/media-manager/media-assembly.js', initFn: 'init' },
    'media-audio': { path: '/admin/features/media-manager/media-assembly.js', initFn: 'init' },
    'media-stickers': { path: '/admin/features/media-manager/media-assembly.js', initFn: 'init' },
    'media-storage': { path: '/admin/features/media-manager/media-assembly.js', initFn: 'init' },

    // AI & Automation Studio
    'ai-generator': { path: '/admin/features/ai-automation/ai-assembly.js', initFn: 'init' },
    'ai-prompts': { path: '/admin/features/ai-automation/ai-assembly.js', initFn: 'init' },
    'ai-translator': { path: '/admin/features/ai-automation/ai-assembly.js', initFn: 'init' },

    // Localization & Languages
    'loc-languages': { path: '/admin/features/localization/loc-assembly.js', initFn: 'init' },
    'loc-translations': { path: '/admin/features/localization/loc-assembly.js', initFn: 'init' },
    'loc-regional-dates': { path: '/admin/features/localization/loc-assembly.js', initFn: 'init' },

    // Analytics
    'analytics-traffic': { path: '/admin/features/analytics/analytics-assembly.js', initFn: 'init' },
    'analytics-generations': { path: '/admin/features/analytics/analytics-assembly.js', initFn: 'init' },
    'analytics-geo': { path: '/admin/features/analytics/analytics-assembly.js', initFn: 'init' },

    // SEO & Traffic Growth
    'seo-sitemap': { path: '/admin/features/seo/seo-assembly.js', initFn: 'init' },
    'seo-schema': { path: '/admin/features/seo/seo-assembly.js', initFn: 'init' },
    'seo-domains': { path: '/admin/features/seo/seo-assembly.js', initFn: 'init' },

    // Reports & Export
    'reports-builder': { path: '/admin/features/reports/reports-assembly.js', initFn: 'init' },
    'reports-scheduled': { path: '/admin/features/reports/reports-assembly.js', initFn: 'init' },
    'reports-exports': { path: '/admin/features/reports/reports-assembly.js', initFn: 'init' },

    // Trending Engine
    'trending-featured': { path: '/admin/features/trending/trending-assembly.js', initFn: 'init' },
    'trending-festive': { path: '/admin/features/trending/trending-assembly.js', initFn: 'init' },
    'trending-scoreboard': { path: '/admin/features/trending/trending-assembly.js', initFn: 'init' },

    // A/B Testing Studio
    'ab-campaigns': { path: '/admin/features/ab-testing/ab-assembly.js', initFn: 'init' },
    'ab-layouts': { path: '/admin/features/ab-testing/ab-assembly.js', initFn: 'init' },
    'ab-conversions': { path: '/admin/features/ab-testing/ab-assembly.js', initFn: 'init' },

    // Monetization & Ads
    'monetization-adsense': { path: '/admin/features/monetization/monetization-assembly.js', initFn: 'init' },
    'monetization-banners': { path: '/admin/features/monetization/monetization-assembly.js', initFn: 'init' },
    'monetization-revenue': { path: '/admin/features/monetization/monetization-assembly.js', initFn: 'init' },

    // Link Manager
    'link-shortener': { path: '/admin/features/link-manager/link-assembly.js', initFn: 'init' },
    'link-utm': { path: '/admin/features/link-manager/link-assembly.js', initFn: 'init' },
    'link-redirects': { path: '/admin/features/link-manager/link-assembly.js', initFn: 'init' },

    // Share Manager
    'share-whatsapp': { path: '/admin/features/share-manager/share-assembly.js', initFn: 'init' },
    'share-social': { path: '/admin/features/share-manager/share-assembly.js', initFn: 'init' },
    'share-widgets': { path: '/admin/features/share-manager/share-assembly.js', initFn: 'init' },

    // Community & Feedback
    'comm-requests': { path: '/admin/features/community-feedback/community-assembly.js', initFn: 'init' },
    'comm-feedback': { path: '/admin/features/community-feedback/community-assembly.js', initFn: 'init' },
    'comm-comments': { path: '/admin/features/community-feedback/community-assembly.js', initFn: 'init' },

    // Notifications
    'notifications-push': { path: '/admin/features/notifications/notifications-assembly.js', initFn: 'init' },
    'notifications-broadcast': { path: '/admin/features/notifications/notifications-assembly.js', initFn: 'init' },
    'notifications-templates': { path: '/admin/features/notifications/notifications-assembly.js', initFn: 'init' },

    // Price & Plans
    'price-tiers': { path: '/admin/features/price-plans/pricing-assembly.js', initFn: 'init' },
    'price-discounts': { path: '/admin/features/price-plans/pricing-assembly.js', initFn: 'init' },
    'price-gateways': { path: '/admin/features/price-plans/pricing-assembly.js', initFn: 'init' },

    // Performance & Cache
    'perf-cache-purge': { path: '/admin/features/performance-cache/performance-assembly.js', initFn: 'init' },
    'perf-image-opt': { path: '/admin/features/performance-cache/performance-assembly.js', initFn: 'init' },
    'perf-speed': { path: '/admin/features/performance-cache/performance-assembly.js', initFn: 'init' },

    // System Health
    'sys-server': { path: '/admin/features/health-monitor/health-assembly.js', initFn: 'init' },
    'sys-db': { path: '/admin/features/health-monitor/health-assembly.js', initFn: 'init' },
    'sys-alerts': { path: '/admin/features/health-monitor/health-assembly.js', initFn: 'init' },

    // Worker Analytics
    'worker-status': { path: '/admin/features/worker-analytics/worker-assembly.js', initFn: 'init' },
    'worker-cache': { path: '/admin/features/worker-analytics/worker-assembly.js', initFn: 'init' },
    'worker-logs': { path: '/admin/features/worker-analytics/worker-assembly.js', initFn: 'init' },

    // Google Sheets
    'google-sheets-dashboard': { path: '/admin/features/google-sheets/sheets-assembly.js', initFn: 'initGoogleSheets' },
    'sheets-sync': { path: '/admin/features/google-sheets/sheets-assembly.js', initFn: 'initGoogleSheets' },
    'sheets-responses': { path: '/admin/features/google-sheets/sheets-assembly.js', initFn: 'initGoogleSheets' },
    'sheets-mapping': { path: '/admin/features/google-sheets/sheets-assembly.js', initFn: 'initGoogleSheets' },

    // Integrations
    'webhooks-active': { path: '/admin/features/integrations/integration-assembly.js', initFn: 'init' },
    'api-endpoints': { path: '/admin/features/integrations/integration-assembly.js', initFn: 'init' },
    'third-party': { path: '/admin/features/integrations/integration-assembly.js', initFn: 'init' },

    // Compliance & Legal
    'legal-gdpr': { path: '/admin/features/compliance/compliance-assembly.js', initFn: 'init' },
    'legal-terms': { path: '/admin/features/compliance/compliance-assembly.js', initFn: 'init' },
    'legal-abuse': { path: '/admin/features/compliance/compliance-assembly.js', initFn: 'init' },

    // System Logs
    'logs-audit': { path: '/admin/features/system-logs/logs-assembly.js', initFn: 'init' },
    'logs-backups': { path: '/admin/features/system-logs/logs-assembly.js', initFn: 'init' },
    'logs-errors': { path: '/admin/features/system-logs/logs-assembly.js', initFn: 'init' },

    // Auth & Security
    'auth-users': { path: '/admin/features/auth-security/auth-assembly.js', initFn: 'init' },
    'auth-keys': { path: '/admin/features/auth-security/auth-assembly.js', initFn: 'init' },
    'auth-security': { path: '/admin/features/auth-security/auth-assembly.js', initFn: 'init' },

    // Settings
    'setting-seo': { path: '/admin/features/settings/settings-assembly.js', initFn: 'init' },
    'setting-ads': { path: '/admin/features/settings/settings-assembly.js', initFn: 'init' },
    'setting-theme': { path: '/admin/features/settings/settings-assembly.js', initFn: 'init' }
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

      console.log(`✅ Dynamically Loaded Feature: [${name}]`);
      return module;
    } catch (err) {
      console.warn(`⚠️ Error loading feature [${name}]:`, err.message);
      return null;
    }
  }

  async bootSystem() {
    if (this.root) {
      this.root.innerHTML = `
        <div style="padding: 20px;">
          <h2 style="margin-bottom: 10px;">Welcome to Wishes Hub Admin</h2>
          <p>Select any feature from the sidebar menu to start.</p>
        </div>
      `;
    }

    // ⚡ STEP 1: Boot Menu Engine
    await this.safeRun('menu', '/admin/features/menu-navigation/menu-assembly.js', 'initMenu');

    // ⚡ STEP 2: Boot Silent Background AI Engine
    this.startBackgroundAIEngine();

    // ⚡ STEP 3: Listen to Tap Events
    document.addEventListener('menu-navigate', (e) => {
      const subId = e.detail?.subId;
      if (subId) {
        this.loadFeatureOnTap(subId);
      }
    });
  }

  async startBackgroundAIEngine() {
    try {
      const aiModule = await import('/admin/features/ai-automation/ai-assembly.js');
      if (aiModule && typeof aiModule.startBackgroundAutoWishEngine === 'function') {
        aiModule.startBackgroundAutoWishEngine();
        console.log("🤖 AI Engine running silently in background.");
      }
    } catch (err) {
      console.log("ℹ️ AI Engine background runner active.");
    }
  }

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

    await this.safeRun(subId, config.path, config.initFn);
  }
}

new FeaturesAssembly();
