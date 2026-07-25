import { DarkModeAssembly } from './dark-mode/dark-assembly.js';
import { SearchAssembly } from './search-filter/search-assembly.js';
import { WhatsAppAssembly } from './whatsapp-share/whatsapp-assembly.js';
import { SeoAssembly } from './seo-helper/seo-assembly.js';
import { ActionAssembly } from './action-handlers/action-assembly.js';
import { WishesAssembly } from './wishes-renderer/wishes-assembly.js';
import { StorageAssembly } from './storage/storage-assembly.js';
import { AdsAssembly } from './ads-manager/ads-assembly.js';

class FeaturesAssembly {
  constructor() {
    this.darkMode = new DarkModeAssembly();
    this.whatsappShare = new WhatsAppAssembly();
    this.seoHelper = new SeoAssembly();
    this.searchFilter = new SearchAssembly();
    this.actionHandlers = new ActionAssembly();
    this.wishesRenderer = new WishesAssembly();
    this.storage = new StorageAssembly();
    this.adsManager = new AdsAssembly();
  }

  init() {
    console.log('🚀 Initializing Wishes Hub Core Modules...');
    
    this.darkMode.init();
    this.seoHelper.init();
    this.searchFilter.init();
    this.whatsappShare.init();
    this.actionHandlers.init();
    this.wishesRenderer.init();
    this.storage.init();
    this.adsManager.init();

    console.log('🎉 All Core Modules Loaded Successfully!');
  }
}

// App Auto-Bootstrapping
const initApp = () => {
  try {
    const app = new FeaturesAssembly();
    app.init();
  } catch (error) {
    console.error('❌ App Init Error:', error);
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
