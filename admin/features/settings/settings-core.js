/**
 * Settings Core Engine
 * Path: admin/features/settings/settings-core.js
 */

import { SETTINGS_CONFIG } from './settings-config.js';

export class SettingsCore {
  constructor() {
    this.seoSettings = {
      siteTitle: 'Wishes Hub - Personalized Greetings & Greeting Cards',
      metaDescription: 'Create and share personalized wishes, cards, and greeting messages online.',
      canonicalUrl: 'https://wishes-hub.vercel.app'
    };

    this.adsenseSettings = {
      publisherId: 'ca-pub-1234567890123456',
      autoAdsEnabled: true,
      headerAdSlot: 'SLOT-883921'
    };

    this.themeSettings = {
      primaryColor: '#007bff',
      darkModeDefault: false,
      customCss: '/* Custom Global Overrides */\n.btn-primary { border-radius: 6px; }'
    };
  }

  getSeoSettings() { return this.seoSettings; }
  getAdsenseSettings() { return this.adsenseSettings; }
  getThemeSettings() { return this.themeSettings; }
}

export const settingsCoreInstance = new SettingsCore();
