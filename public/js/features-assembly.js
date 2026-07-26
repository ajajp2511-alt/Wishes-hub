// Core Feature Module Imports
import { initBaseLayout } from '/js/base-layout/index.js';
import { initDarkMode } from '/js/dark-mode/index.js';
import { initSearchFilter } from '/js/search-filter/index.js';
import { initWhatsappShare } from '/js/whatsapp-share/index.js';
import { initSeoHelper } from '/js/seo-helper/index.js';
import { initActions } from '/js/actions/index.js';
import { initWishesRenderer } from '/js/wishes-renderer/index.js';
import { initStorage } from '/js/storage/index.js';
import { initAdsManager } from '/js/ads-manager/index.js';

/**
 * FeaturesAssembly Class
 * Orchestrates all modular app features safely
 */
export class FeaturesAssembly {
  constructor() {
    console.log("🚀 Initializing Wishes Hub Core Modules...");
    this.modules = {};
    this.bootSystem();
  }

  async bootSystem() {
    console.log("Wishes Hub: System Booting...");

    // Safe Execution Wrapper to prevent one broken module from crashing the app
    const safeRun = async (name, fn) => {
      try {
        if (typeof fn === 'function') {
          const result = await fn();
          console.log(`✅ Module Loaded: ${name}`);
          return result;
        }
      } catch (err) {
        console.warn(`⚠️ Module Failed: [${name}]`, err.message);
        return null;
      }
    };

    try {
      this.modules.baseLayout = await safeRun('baseLayout', initBaseLayout);
      this.modules.darkMode = await safeRun('darkMode', initDarkMode);
      this.modules.searchFilter = await safeRun('searchFilter', initSearchFilter);
      this.modules.whatsappShare = await safeRun('whatsappShare', initWhatsappShare);
      this.modules.seoHelper = await safeRun('seoHelper', initSeoHelper);
      this.modules.actions = await safeRun('actions', initActions);
      this.modules.wishesRenderer = await safeRun('wishesRenderer', initWishesRenderer);
      this.modules.storage = await safeRun('storage', initStorage);
      this.modules.adsManager = await safeRun('adsManager', initAdsManager);

      console.log("Wishes Hub: All Systems Online!");
      console.log("🎉 All Core Modules Execution Attempt Completed!");
    } catch (error) {
      console.error("❌ Critical Error during system assembly:", error);
    }
  }
}

// Global Auto-initialization (Handles both fast & DOMContentLoaded events)
if (document.readyState === "loading") {
  document.addEventListener('DOMContentLoaded', () => {
    window.appFeatures = new FeaturesAssembly();
  });
} else {
  window.appFeatures = new FeaturesAssembly();
        }
