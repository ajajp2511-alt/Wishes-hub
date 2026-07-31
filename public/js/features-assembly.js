console.log("📌 Features Assembly script loaded!");

// Har module ki dedicated assembly file ko connect kar rahe hain
import { initBaseLayout } from '/js/base-layout/index.js';
import { initDarkMode } from '/js/dark-mode/dark-assembly.js';
import { initSearchFilter } from '/js/search-filter/search-assembly.js';
import { initWhatsappShare } from '/js/whatsapp-share/whatsapp-assembly.js';
import { initSeoHelper } from '/js/seo-helper/seo-assembly.js';
import { initActions } from '/js/action-handlers/action-assembly.js';
import { initWishesRenderer } from '/js/wishes-renderer/wishes-assembly.js';
import { initStorage } from '/js/storage/storage-assembly.js';
import { initAdsManager } from '/js/ads-manager/ads-assembly.js';
import { initMenuNavigation } from '/js/menu-navigation/menu-assembly.js';

// 💥 Favorites Assembly Import (Exports: assembleFavorites, syncFavoritesUI)
import { assembleFavorites, syncFavoritesUI } from '/js/favorites/favorites-assembly.js';

// Wrapper for Favorites Initialization
const initFavorites = async () => {
  if (typeof assembleFavorites === 'function') assembleFavorites();
  if (typeof syncFavoritesUI === 'function') await syncFavoritesUI();
};

export class FeaturesAssembly {
  constructor() {
    console.log("🚀 Booting Wishes Hub System...");
    this.bootSystem();
  }

  // Safe Wrapper Utility
  async safeRun(name, fn) {
    try {
      if (typeof fn === 'function') {
        const result = await fn();
        console.log(`✅ Module Loaded: ${name}`);
        return result;
      }
    } catch (err) {
      // Isolates module crash without freezing the whole UI
      console.error(`⚠️ Module Crash Shielded: [${name}]`, err);
      return null;
    }
  }

  async bootSystem() {
    // Phase 1: Core Layout (Mandatory rendering before rest of modules)
    await this.safeRun('baseLayout', initBaseLayout);
    await this.safeRun('menuNavigation', initMenuNavigation);

    // Phase 2: Independent Features (Parallel Execution for fast performance)
    await Promise.allSettled([
      this.safeRun('darkMode', initDarkMode),
      this.safeRun('searchFilter', initSearchFilter),
      this.safeRun('whatsappShare', initWhatsappShare),
      this.safeRun('seoHelper', initSeoHelper),
      this.safeRun('actions', initActions),
      this.safeRun('wishesRenderer', initWishesRenderer),
      this.safeRun('storage', initStorage),
      this.safeRun('adsManager', initAdsManager),
      // 💥 Favorites Bootstrapping
      this.safeRun('favorites', initFavorites)
    ]);

    console.log("🎉 All Module Assemblies Successfully Initialized!");
  }
}

// Auto Bootstrapping
if (document.readyState === "loading") {
  document.addEventListener('DOMContentLoaded', () => new FeaturesAssembly());
} else {
  new FeaturesAssembly();
}
