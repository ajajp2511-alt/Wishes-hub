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
 * Orchestrates all modular app features and system initialization
 */
export class FeaturesAssembly {
  constructor() {
    console.log("🚀 Initializing Wishes Hub Core Modules...");
    this.modules = {};
    this.bootSystem();
  }

  bootSystem() {
    try {
      console.log("Wishes Hub: System Booting...");

      // Initialize Architecture Modules
      this.modules.baseLayout = initBaseLayout();
      this.modules.darkMode = initDarkMode();
      this.modules.searchFilter = initSearchFilter();
      this.modules.whatsappShare = initWhatsappShare();
      this.modules.seoHelper = initSeoHelper();
      this.modules.actions = initActions();
      this.modules.wishesRenderer = initWishesRenderer();
      this.modules.storage = initStorage();
      this.modules.adsManager = initAdsManager();

      console.log("Wishes Hub: All Systems Online!");
      console.log("🎉 All Core Modules Loaded Successfully!");
    } catch (error) {
      console.error("❌ Critical Error during system assembly:", error);
    }
  }
}

// Global Auto-initialization
document.addEventListener('DOMContentLoaded', () => {
  window.appFeatures = new FeaturesAssembly();
});
