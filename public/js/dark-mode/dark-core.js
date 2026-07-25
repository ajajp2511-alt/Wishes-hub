import { DARK_MODE_CONFIG } from './dark-config.js';

export class DarkModeCore {
  constructor() {
    this.currentTheme = localStorage.getItem(DARK_MODE_CONFIG.STORAGE_KEY) || DARK_MODE_CONFIG.THEMES.LIGHT;
  }

  getTheme() {
    return this.currentTheme;
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === DARK_MODE_CONFIG.THEMES.DARK
      ? DARK_MODE_CONFIG.THEMES.LIGHT
      : DARK_MODE_CONFIG.THEMES.DARK;

    localStorage.setItem(DARK_MODE_CONFIG.STORAGE_KEY, this.currentTheme);
    return this.currentTheme;
  }

  isDark() {
    return this.currentTheme === DARK_MODE_CONFIG.THEMES.DARK;
  }
}
