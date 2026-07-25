// Import All Feature Modules (Relative to /public/js/)
import { DarkModeAssembly } from './dark-mode/dark-assembly.js';
import { MusicAssembly } from './music-player/music-assembly.js';
import { SearchAssembly } from './search-filter/search-assembly.js';
import { WhatsAppAssembly } from './whatsapp-share/whatsapp-assembly.js';
import { AdsAssembly } from './ads-manager/ads-assembly.js';
import { SeoAssembly } from './seo-helper/seo-assembly.js';

class FeaturesAssembly {
  constructor() {
    this.darkMode = new DarkModeAssembly();
    this.musicPlayer = new MusicAssembly();
    this.whatsAppShare = new WhatsAppAssembly();
    this.adsManager = new AdsAssembly();
    this.seoHelper = new SeoAssembly();

    // Function to render search results dynamic UI safely
    this.renderSearchResults = (filteredItems) => {
      const container = document.querySelector('#wishes-list');
      if (!container) return;

      if (!filteredItems || filteredItems.length === 0) {
        container.innerHTML = `<p class="no-results">Koi wishes nahi mili!</p>`;
        return;
      }

      container.innerHTML = filteredItems.map(item => `
        <div class="wish-card" data-category="${item.category}">
          <h3>${item.title}</h3>
          <p>${item.message}</p>
          <button class="whatsapp-share-btn" data-message="${item.message}">Share on WhatsApp</button>
        </div>
      `).join('');

      if (this.whatsAppShare && typeof this.whatsAppShare.init === 'function') {
        this.whatsAppShare.init();
      }
    };

    this.searchFilter = new SearchAssembly(this.renderSearchResults);
  }

  init() {
    console.log('🚀 Initializing Wishes Hub via features-assembly.js...');

    // 1. Initialize SEO Metadata
    this.seoHelper.init({
      title: 'Wishes Hub - Special Event Greetings',
      description: 'Explore and share personalized wishes with music and themes!'
    });

    // 2. Initialize Core UI Features
    this.darkMode.init();
    this.musicPlayer.init('./assets/audio/default-bgm.mp3');
    this.whatsAppShare.init();

    // 3. Initialize Search Data
    const initialWishesData = [
      { id: 1, title: 'Happy Birthday', category: 'birthday', message: 'Wishing you a fantastic day ahead!' },
      { id: 2, title: 'Happy Anniversary', category: 'anniversary', message: 'May your love grow stronger every day!' }
    ];
    this.searchFilter.init(initialWishesData);

    // 4. Initialize Ads Engine
    this.adsManager.init();

    console.log('✅ All feature modules assembled successfully!');
  }
}

// Direct Safe Execution for ES Modules
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
