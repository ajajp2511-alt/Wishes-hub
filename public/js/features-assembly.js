console.log("📌 Features Assembly Orchestrator Booting...");

export class FeaturesAssembly {
  constructor() {
    console.log("🚀 Booting Wishes Hub System with Bulletproof Shielding...");
    this.bootSystem();
  }

  /**
   * 🛡️ SAFE ISOLATION LAUNCHER
   * Dynamic import() use karke har module ko isolated sandbox me load karta hai.
   */
  async safeRun(name, importPath, initFns) {
    try {
      // 1. Dynamic Import: Agar file 404 ya corrupt bhi ho, execution yahan nahi rukega
      const module = await import(importPath);

      if (!module) return null;

      // 2. Agar Multiple functions execution pass kiye hain (e.g. Favorites)
      if (Array.isArray(initFns)) {
        for (const fnName of initFns) {
          if (typeof module[fnName] === 'function') {
            await module[fnName]();
          }
        }
      } 
      // Single Function execution
      else if (typeof module[initFns] === 'function') {
        await module[initFns]();
      }

      console.log(`✅ Module Loaded Successfully: [${name}]`);
      return module;
    } catch (err) {
      // 💥 SHIELD ACTIVE: Crash hone par bas warning console me aayegi, site normal chalegi!
      console.warn(`🛡️ [Shield Intercepted Error in ${name}]: Site is fully safe. Details:`, err.message);
      return null;
    }
  }

  async bootSystem() {
    // Phase 1: Core Layout (Absolute relative pathing for Vercel)
    await this.safeRun('baseLayout', './base-layout/index.js', 'initBaseLayout');
    await this.safeRun('menuNavigation', './menu-navigation/menu-assembly.js', 'initMenuNavigation');

    // Phase 2: Independent Features (Parallel Execution via Promise.allSettled)
    await Promise.allSettled([
      this.safeRun('darkMode', './dark-mode/dark-assembly.js', 'initDarkMode'),
      this.safeRun('searchFilter', './search-filter/search-assembly.js', 'initSearchFilter'),
      this.safeRun('whatsappShare', './whatsapp-share/whatsapp-assembly.js', 'initWhatsappShare'),
      this.safeRun('seoHelper', './seo-helper/seo-assembly.js', 'initSeoHelper'),
      this.safeRun('actions', './action-handlers/action-assembly.js', 'initActions'),
      this.safeRun('wishesRenderer', './wishes-renderer/wishes-assembly.js', 'initWishesRenderer'),
      this.safeRun('storage', './storage/storage-assembly.js', 'initStorage'),
      this.safeRun('adsManager', './ads-manager/ads-assembly.js', 'initAdsManager'),
      // 💥 Favorites Module (Runs assembleFavorites then syncFavoritesUI safely)
      this.safeRun('favorites', './favorites/favorites-assembly.js', ['assembleFavorites', 'syncFavoritesUI'])
    ]);

    console.log("🎉 All Module Assemblies Initialized (Fault Tolerance Active)!");
  }
}

// Auto Bootstrapping
if (document.readyState === "loading") {
  document.addEventListener('DOMContentLoaded', () => new FeaturesAssembly());
} else {
  new FeaturesAssembly();
}
