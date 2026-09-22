console.log("⚡ features-assembly.js initialized with Universal Smart Router!");

import { assembleHomeModule } from './manage-home/manage-home-assembly.js';

// --- On-Screen Visual Error Logger Integration ---
window.onerror = function (msg, url, lineNo, columnNo, error) {
  const errorMsg = `UI Error: ${msg} (${url}:${lineNo}:${columnNo})`;
  console.error(errorMsg);
  showVisualErrorOverlay(errorMsg);
  return false;
};

window.addEventListener('unhandledrejection', function (event) {
  const errorMsg = `Async Error: ${event.reason?.message || event.reason}`;
  console.error(errorMsg);
  showVisualErrorOverlay(errorMsg);
});

function showVisualErrorOverlay(message) {
  let existingOverlay = document.getElementById('visual-error-logger-box');
  if (!existingOverlay) {
    existingOverlay = document.createElement('div');
    existingOverlay.id = 'visual-error-logger-box';
    existingOverlay.style.cssText = `
      position: fixed; bottom: 10px; left: 10px; right: 10px; max-height: 200px;
      overflow-y: auto; background: rgba(217, 83, 79, 0.95); color: white;
      padding: 12px; border-radius: 8px; z-index: 99999; font-family: monospace;
      font-size: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.3);
    `;
    document.body.appendChild(existingOverlay);
  }
  existingOverlay.innerHTML += `<div>❌ ${message}</div>`;
}
// ------------------------------------------------

export class FeaturesAssembly {
  constructor() {
    console.log("🚀 Booting Dynamic System Architecture...");
    this.root = document.getElementById('dynamic-content-root');
    this.loadedModules = new Map();
    this.bootSystem();
  }

  featureRegistry = {
    // Menu System (Added to fix boot navigation error)
    'menu': { path: './menu-navigation/menu-assembly.js', initFn: 'initMenu' },

    // Create Wish
    'create-text': { path: './create-wish/create-wish-assembly.js', initFn: 'init' },
    'create-image': { path: './create-wish/create-wish-assembly.js', initFn: 'init' },
    'create-audio': { path: './create-wish/create-wish-assembly.js', initFn: 'init' },
    'create-video': { path: './create-wish/create-wish-assembly.js', initFn: 'init' },
    'create-story': { path: './create-wish/create-wish-assembly.js', initFn: 'init' },
    'create-interactive': { path: './create-wish/create-wish-assembly.js', initFn: 'init' },
    'create-ai': { path: './create-wish/create-wish-assembly.js', initFn: 'init' },

    // Asset Hub
    'asset-animations': { path: './assets/assets-assembly.js', initFn: 'init' },
    'asset-songs': { path: './assets/assets-assembly.js', initFn: 'init' },
    'asset-invitations': { path: './assets/assets-assembly.js', initFn: 'init' },
    'asset-particles': { path: './assets/assets-assembly.js', initFn: 'init' },
    'asset-fonts': { path: './assets/assets-assembly.js', initFn: 'init' },
    'asset-frames': { path: './assets/assets-assembly.js', initFn: 'init' },
    'asset-stickers': { path: './assets/assets-assembly.js', initFn: 'init' },
    'asset-palettes': { path: './assets/assets-assembly.js', initFn: 'init' },
    
    // Manage Loading & Overlays
    'loading-spinner': { path: './manage-loading/manage-loading-assembly.js', initFn: 'init' },
    'loading-overlay': { path: './manage-loading/manage-loading-assembly.js', initFn: 'init' },
    'loading-safety': { path: './manage-loading/manage-loading-assembly.js', initFn: 'init' },
    'loading-health': { path: './manage-loading/manage-loading-assembly.js', initFn: 'init' },
    'loading-history': { path: './manage-loading/manage-loading-assembly.js', initFn: 'init' },
    'loading-analytics': { path: './manage-loading/manage-loading-assembly.js', initFn: 'init' },
    'loading-template': { path: './manage-loading/manage-loading-assembly.js', initFn: 'init' },
 
    // Wishes Manager
    'wishes-all': { path: './manage-wish/manage-wish-assembly.js', initFn: 'init' },
    'wishes-categories': { path: './manage-wish/manage-wish-assembly.js', initFn: 'init' },
    'wishes-templates': { path: './manage-wish/manage-wish-assembly.js', initFn: 'init' },

    // Users CRM
    'users-all': { path: './users-crm/users-assembly.js', initFn: 'init' },
    'users-activity': { path: './users-crm/users-assembly.js', initFn: 'init' },
    'users-saved': { path: './users-crm/users-assembly.js', initFn: 'init' },
    'users-data-collected': { path: './users-crm/users-assembly.js', initFn: 'init' },

    // Security Shield
    'sec-threat-logs': { path: './security-shield/security-assembly.js', initFn: 'init' },
    'sec-ip-blacklist': { path: './security-shield/security-assembly.js', initFn: 'init' },
    'sec-bot-protection': { path: './security-shield/security-assembly.js', initFn: 'init' },
    'sec-2fa-sessions': { path: './security-shield/security-assembly.js', initFn: 'init' },

    // PWA Manager
    'pwa-manifest': { path: './app-pwa-manager/pwa-assembly.js', initFn: 'init' },
    'pwa-tokens': { path: './app-pwa-manager/pwa-assembly.js', initFn: 'init' },
    'pwa-deeplinks': { path: './app-pwa-manager/pwa-assembly.js', initFn: 'init' },

    // Feature Flags
    'flags-toggles': { path: './feature-flags-staging/feature-flags-assembly.js', initFn: 'init' },
    'flags-staging': { path: './feature-flags-staging/feature-flags-assembly.js', initFn: 'init' },
    'flags-rollback': { path: './feature-flags-staging/feature-flags-assembly.js', initFn: 'init' },

    // Gamification
    'gami-streaks': { path: './gamification-rewards/gamification-assembly.js', initFn: 'init' },
    'gami-spin': { path: './gamification-rewards/gamification-assembly.js', initFn: 'init' },
    'gami-leaderboard': { path: './gamification-rewards/gamification-assembly.js', initFn: 'init' },

    // Marketplace
    'market-store': { path: './marketplace-creators/marketplace-assembly.js', initFn: 'init' },
    'market-creators': { path: './marketplace-creators/marketplace-assembly.js', initFn: 'init' },
    'market-payouts': { path: './marketplace-creators/marketplace-assembly.js', initFn: 'init' },

    // Campaigns
    'camp-scheduler': { path: './campaigns-marketing/marketing-assembly.js', initFn: 'init' },
    'camp-bots': { path: './campaigns-marketing/marketing-assembly.js', initFn: 'init' },
    'camp-newsletters': { path: './campaigns-marketing/marketing-assembly.js', initFn: 'init' },

    // Content Engine
    'engine-canvas': { path: './content-templates/content-assembly.js', initFn: 'init' },
    'engine-fonts': { path: './content-templates/content-assembly.js', initFn: 'init' },
    'engine-packs': { path: './content-templates/content-assembly.js', initFn: 'init' },

    // Media Manager
    'media-images': { path: './media-manager/media-assembly.js', initFn: 'init' },
    'media-audio': { path: './media-manager/media-assembly.js', initFn: 'init' },
    'media-stickers': { path: './media-manager/media-assembly.js', initFn: 'init' },
    'media-storage': { path: './media-manager/media-assembly.js', initFn: 'init' },

    // AI Automation Studio
    'ai-generator': { path: './ai-automation/ai-assembly.js', initFn: 'init' },
    'ai-prompts': { path: './ai-automation/ai-assembly.js', initFn: 'init' },
    'ai-translator': { path: './ai-automation/ai-assembly.js', initFn: 'init' },

    // Localization
    'loc-languages': { path: './localization/loc-assembly.js', initFn: 'init' },
    'loc-translations': { path: './localization/loc-assembly.js', initFn: 'init' },
    'loc-regional-dates': { path: './localization/loc-assembly.js', initFn: 'init' },

    // Analytics
    'analytics-traffic': { path: './analytics/analytics-assembly.js', initFn: 'init' },
    'analytics-generations': { path: './analytics/analytics-assembly.js', initFn: 'init' },
    'analytics-geo': { path: './analytics/analytics-assembly.js', initFn: 'init' },

    // SEO
    'seo-sitemap': { path: './seo/seo-assembly.js', initFn: 'init' },
    'seo-schema': { path: './seo/seo-assembly.js', initFn: 'init' },
    'seo-domains': { path: './seo/seo-assembly.js', initFn: 'init' },

    // Reports
    'reports-builder': { path: './reports/reports-assembly.js', initFn: 'init' },
    'reports-scheduled': { path: './reports/reports-assembly.js', initFn: 'init' },
    'reports-exports': { path: './reports/reports-assembly.js', initFn: 'init' },

    // Trending Engine
    'trending-featured': { path: './trending/trending-assembly.js', initFn: 'init' },
    'trending-festive': { path: './trending/trending-assembly.js', initFn: 'init' },
    'trending-scoreboard': { path: './trending/trending-assembly.js', initFn: 'init' },

    // A/B Testing
    'ab-campaigns': { path: './ab-testing/ab-assembly.js', initFn: 'init' },
    'ab-layouts': { path: './ab-testing/ab-assembly.js', initFn: 'init' },
    'ab-conversions': { path: './ab-testing/ab-assembly.js', initFn: 'init' },

    // Monetization
    'monetization-adsense': { path: './monetization/monetization-assembly.js', initFn: 'init' },
    'monetization-banners': { path: './monetization/monetization-assembly.js', initFn: 'init' },
    'monetization-revenue': { path: './monetization/monetization-assembly.js', initFn: 'init' },

    // Link Manager
    'link-shortener': { path: './link-manager/link-assembly.js', initFn: 'init' },
    'link-utm': { path: './link-manager/link-assembly.js', initFn: 'init' },
    'link-redirects': { path: './link-manager/link-assembly.js', initFn: 'init' },

    // Share Manager
    'share-whatsapp': { path: './share-manager/share-assembly.js', initFn: 'init' },
    'share-social': { path: './share-manager/share-assembly.js', initFn: 'init' },
    'share-widgets': { path: './share-manager/share-assembly.js', initFn: 'init' },

    // Community
    'comm-requests': { path: './community-feedback/community-assembly.js', initFn: 'init' },
    'comm-feedback': { path: './community-feedback/community-assembly.js', initFn: 'init' },
    'comm-comments': { path: './community-feedback/community-assembly.js', initFn: 'init' },

    // Notifications
    'notifications-push': { path: './notifications/notifications-assembly.js', initFn: 'init' },
    'notifications-broadcast': { path: './notifications/notifications-assembly.js', initFn: 'init' },
    'notifications-templates': { path: './notifications/notifications-assembly.js', initFn: 'init' },

    // Pricing
    'price-tiers': { path: './price-plans/pricing-assembly.js', initFn: 'init' },
    'price-discounts': { path: './price-plans/pricing-assembly.js', initFn: 'init' },
    'price-gateways': { path: './price-plans/pricing-assembly.js', initFn: 'init' },

    // Performance Cache
    'perf-cache-purge': { path: './performance-cache/performance-assembly.js', initFn: 'init' },
    'perf-image-opt': { path: './performance-cache/performance-assembly.js', initFn: 'init' },
    'perf-speed': { path: './performance-cache/performance-assembly.js', initFn: 'init' },

    // System Health
    'sys-server': { path: './health-monitor/health-assembly.js', initFn: 'init' },
    'sys-db': { path: './health-monitor/health-assembly.js', initFn: 'init' },
    'sys-alerts': { path: './health-monitor/health-assembly.js', initFn: 'init' },

    // Worker Analytics
    'worker-status': { path: './worker-analytics/worker-assembly.js', initFn: 'init' },
    'worker-cache': { path: './worker-analytics/worker-assembly.js', initFn: 'init' },
    'worker-logs': { path: './worker-analytics/worker-assembly.js', initFn: 'init' },

    // Google Sheets
    'google-sheets-dashboard': { path: './google-sheets/sheets-assembly.js', initFn: 'initGoogleSheets' },
    'sheets-sync': { path: './google-sheets/sheets-assembly.js', initFn: 'initGoogleSheets' },
    'sheets-responses': { path: './google-sheets/sheets-assembly.js', initFn: 'initGoogleSheets' },
    'sheets-mapping': { path: './google-sheets/sheets-assembly.js', initFn: 'initGoogleSheets' },

    // Integrations
    'webhooks-active': { path: './integrations/integration-assembly.js', initFn: 'init' },
    'api-endpoints': { path: './integrations/integration-assembly.js', initFn: 'init' },
    'third-party': { path: './integrations/integration-assembly.js', initFn: 'init' },

    // Compliance
    'legal-gdpr': { path: './compliance/compliance-assembly.js', initFn: 'init' },
    'legal-terms': { path: './compliance/compliance-assembly.js', initFn: 'init' },
    'legal-abuse': { path: './compliance/compliance-assembly.js', initFn: 'init' },

    // System Logs
    'logs-audit': { path: './system-logs/logs-assembly.js', initFn: 'init' },
    'logs-backups': { path: './system-logs/logs-assembly.js', initFn: 'init' },
    'logs-errors': { path: './system-logs/logs-assembly.js', initFn: 'init' },

    // Auth & Security
    'auth-users': { path: './auth-security/auth-assembly.js', initFn: 'init' },
    'auth-keys': { path: './auth-security/auth-assembly.js', initFn: 'init' },
    'auth-security': { path: './auth-security/auth-assembly.js', initFn: 'init' },

    // Settings
    'setting-seo': { path: './settings/settings-assembly.js', initFn: 'init' },
    'setting-ads': { path: './settings/settings-assembly.js', initFn: 'init' },
    'setting-theme': { path: './settings/settings-assembly.js', initFn: 'init' },

    // Newly Integrated Modules
    'wallet-overview': { path: './wallet-manager/wallet-assembly.js', initFn: 'init' },
    'wallet-transactions': { path: './wallet-manager/wallet-assembly.js', initFn: 'init' },
    'wallet-commissions': { path: './wallet-manager/wallet-assembly.js', initFn: 'init' },

    'categories-all': { path: './categories/categories-assembly.js', initFn: 'init' },
    'categories-add': { path: './categories/categories-assembly.js', initFn: 'init' },

    'geo-settings': { path: './geo/geo-assembly.js', initFn: 'init' },
    'geo-vpn-logs': { path: './geo/geo-assembly.js', initFn: 'init' },

    'lang-settings': { path: './global-language/global-language-assembly.js', initFn: 'init' },
    'lang-translations': { path: './global-language/global-language-assembly.js', initFn: 'init' },

    'branding-variants': { path: './logo-branding-manager/branding-assembly.js', initFn: 'init' },
    'branding-watermark': { path: './logo-branding-manager/branding-assembly.js', initFn: 'init' },

    'platform-builds': { path: './omni-platform-exporter/omni-assembly.js', initFn: 'init' },
    'platform-targets': { path: './omni-platform-exporter/omni-assembly.js', initFn: 'init' },
    
    // --- User Permissions Module ---
    'user-perm-types': { path: './user-permissions/user-permissions-assembly.js', initFn: 'init' },
    'user-perm-config': { path: './user-permissions/user-permissions-assembly.js', initFn: 'init' },
    'user-perm-messages': { path: './user-permissions/user-permissions-assembly.js', initFn: 'init' },

    // --- Manage Permissions Module ---
    'manage-perm-config': { path: './manage-permissions/manage-permissions-assembly.js', initFn: 'init' },
    'manage-perm-roles': { path: './manage-permissions/manage-permissions-assembly.js', initFn: 'init' },
    'manage-perm-actions': { path: './manage-permissions/manage-permissions-assembly.js', initFn: 'init' },

    'support-tickets': { path: './support-manager/support-assembly.js', initFn: 'init' },
    'support-settings': { path: './support-manager/support-assembly.js', initFn: 'init' }
  };

  async safeRun(name, importPath, initFn) {
    try {
      let module = this.loadedModules.get(name);
      if (!module) {
        module = await import(importPath);
        this.loadedModules.set(name, module);
      }

      if (!module) return false;

      // 1. Direct function export
      if (typeof module[initFn] === 'function') {
        await module[initFn]('dynamic-content-root', name);
        return true;
      }

      // 2. Exported Class Instance
      for (const key of Object.keys(module)) {
        if (module[key] && typeof module[key][initFn] === 'function') {
          await module[key][initFn]('dynamic-content-root', name);
          return true;
        }
      }

      // 3. Default Class / Function Export
      if (module.default) {
        if (typeof module.default[initFn] === 'function') {
          await module.default[initFn]('dynamic-content-root', name);
          return true;
        }
        if (typeof module.default === 'function') {
          try {
            const instance = new module.default();
            if (typeof instance[initFn] === 'function') {
              await instance[initFn]('dynamic-content-root', name);
              return true;
            }
          } catch (e) {
            await module.default('dynamic-content-root', name);
            return true;
          }
        }
      }

      console.warn(`⚠️ Warning: No executable '${initFn}' method found in [${importPath}]`);
      showVisualErrorOverlay(`No '${initFn}' found in ${importPath}`);
      return false;
    } catch (err) {
      console.error(`❌ Module dynamic import error [${name}]:`, err);
      showVisualErrorOverlay(`Import Fail [${name}]: ${err.message}`);
      return false;
    }
  }

  async bootSystem() {
    if (this.root) {
      this.root.innerHTML = '';
      assembleHomeModule('dynamic-content-root');
    }

    // ⚡ Init Menu System
    await this.safeRun('menu', './menu-navigation/menu-assembly.js', 'initMenu');

    // ⚡ Start Background AI Engine
    this.startBackgroundAIEngine();

    // ⚡ Tap Navigation Listener
    document.addEventListener('menu-navigate', (e) => {
      const subId = e.detail?.subId;
      if (subId) {
        this.loadFeatureOnTap(subId);
      }
    });
  }

  async startBackgroundAIEngine() {
    try {
      const aiModule = await import('./ai-automation/ai-assembly.js');
      if (aiModule && typeof aiModule.startBackgroundAutoWishEngine === 'function') {
        aiModule.startBackgroundAutoWishEngine();
        console.log("🤖 Silent AI engine running.");
      }
    } catch (err) {
      console.log("ℹ️ AI Engine ready.");
    }
  }

  async loadFeatureOnTap(subId) {
    const config = this.featureRegistry[subId];

    if (!config) {
      this.renderFallback(subId, "Feature key not found in router registry.");
      return;
    }

    if (this.root) {
      this.root.innerHTML = `<div style="padding: 20px;"><p>Loading module...</p></div>`;
    }

    const isSuccess = await this.safeRun(subId, config.path, config.initFn);

    if (!isSuccess) {
      this.renderFallback(subId, `Failed to initialize module from path: ${config.path}`);
    }
  }

  renderFallback(subId, message) {
    if (this.root) {
      this.root.innerHTML = `
        <div style="padding: 20px;">
          <h2 style="margin-bottom: 8px; text-transform: capitalize;">${subId.replace(/-/g, ' ')}</h2>
          <p style="color: #d9534f;">${message}</p>
        </div>
      `;
    }
  }
}

new FeaturesAssembly();
