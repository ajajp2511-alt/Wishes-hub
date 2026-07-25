import { DARK_MODE_CONFIG } from './dark-config.js';
import { DarkModeCore } from './dark-core.js';

export class DarkModeAssembly {
  constructor() {
    this.core = new DarkModeCore();
  }

  init() {
    this.applyTheme(this.core.getTheme());
    this.bindEvents();
  }

  applyTheme(theme) {
    if (theme === DARK_MODE_CONFIG.THEMES.DARK) {
      document.body.classList.add(DARK_MODE_CONFIG.SELECTORS.BODY_CLASS);
    } else {
      document.body.classList.remove(DARK_MODE_CONFIG.SELECTORS.BODY_CLASS);
    }
  }

  bindEvents() {
    const toggleBtn = document.querySelector(DARK_MODE_CONFIG.SELECTORS.TOGGLE_BTN);
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const newTheme = this.core.toggleTheme();
        this.applyTheme(newTheme);
      });
    }
  }
}
