console.log("📌 Features Assembly script loaded!");

// Har module ki dedicated assembly file ko connect kar rahe hain
import { initBaseLayout } from '/js/base-layout/index.js';
import { initDarkMode } from '/js/dark-mode/dark-assembly.js';
import { initSearchFilter } from '/js/search-filter/search-assembly.js';
import { initWhatsappShare } from '/js/whatsapp-share/whatsapp-assembly.js';
import { initSeoHelper } from '/js/seo-helper/seo-assembly.js';
import { initActions } from '/js/action-handlers/action-handlers.js';
import { initWishesRenderer } from '/js/wishes-renderer/wishes-assembly.js';
import { initStorage } from '/js/storage/storage-assembly.js';
import { initAdsManager } from '/js/ads-manager/ads-manager.js';

export class FeaturesAssembly {
  constructor() {
    console.log("🚀 Booting Wishes Hub System...");
    this.bootSystem();
  }

  async bootSystem() {
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

    // Sequential Execution
    await safeRun('baseLayout', initBaseLayout);
    await safeRun('darkMode', initDarkMode);
    await safeRun('searchFilter', initSearchFilter);
    await safeRun('whatsappShare', initWhatsappShare);
    await safeRun('seoHelper', initSeoHelper);
    await safeRun('actions', initActions);
    await safeRun('wishesRenderer', initWishesRenderer);
    await safeRun('storage', initStorage);
    await safeRun('adsManager', initAdsManager);

    console.log("🎉 All Module Assemblies Connected!");
  }
}

if (document.readyState === "loading") {
  document.addEventListener('DOMContentLoaded', () => new FeaturesAssembly());
} else {
  new FeaturesAssembly();
}
