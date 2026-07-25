import { DarkModeAssembly } from './dark-mode/dark-assembly.js';

class FeaturesAssembly {
  constructor() {
    this.darkMode = new DarkModeAssembly();
  }

  init() {
    console.log('🚀 Initializing Wishes Hub Modules...');
    
    // 1. Dark Mode
    this.darkMode.init();

    console.log('✅ Dark Mode module active!');
  }
}

// Global App Initialization
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
