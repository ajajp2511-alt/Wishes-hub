import { DarkModeAssembly } from './dark-mode/dark-assembly.js';
import { SearchAssembly } from './search-filter/search-assembly.js';
import { WhatsAppAssembly } from './whatsapp-share/whatsapp-assembly.js';

class FeaturesAssembly {
  constructor() {
    this.darkMode = new DarkModeAssembly();
    this.whatsappShare = new WhatsAppAssembly();

    this.renderSearchResults = (filteredItems) => {
      const container = document.querySelector('#wishes-list');
      if (!container) return;

      if (!filteredItems || filteredItems.length === 0) {
        container.innerHTML = '<p style="padding: 15px; text-align: center; color: #888;">Koi wish nahi mili!</p>';
        return;
      }

      container.innerHTML = filteredItems.map(item => `
        <div class="wish-card" style="border: 1px solid #444; padding: 12px; margin: 10px 0; border-radius: 8px;">
          <h3 style="margin: 0 0 5px 0;">${item.title}</h3>
          <p style="margin: 0 0 10px 0;">${item.message}</p>
          <button class="whatsapp-share-btn" data-wish-message="${item.message}" style="background-color: #25D366; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">
            📲 Share on WhatsApp
          </button>
        </div>
      `).join('');
    };

    this.searchFilter = new SearchAssembly(this.renderSearchResults);
  }

  init() {
    console.log('🚀 Initializing Wishes Hub Modules...');
    
    // 1. Dark Mode
    this.darkMode.init();
    console.log('✅ Dark Mode module active!');

    // 2. Search & Filter
    const dummyData = [
      { id: 1, title: 'Happy Birthday!', category: 'birthday', message: 'Wishing you a fantastic day ahead!' },
      { id: 2, title: 'Happy Anniversary!', category: 'anniversary', message: 'May your love grow stronger every day!' },
      { id: 3, title: 'Birthday Bash', category: 'birthday', message: 'Have a great birthday party!' }
    ];

    this.searchFilter.init(dummyData);
    console.log('✅ Search & Filter module active!');

    // 3. WhatsApp Share
    this.whatsappShare.init();
    console.log('✅ WhatsApp Share module active!');
  }
}

// App Initialization
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
