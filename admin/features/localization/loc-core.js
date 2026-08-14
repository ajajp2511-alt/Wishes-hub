/**
 * Localization Core Engine
 * Path: admin/features/localization/loc-core.js
 */

import { LOC_CONFIG } from './loc-config.js';

export class LocalizationCore {
  constructor() {
    this.locales = [...LOC_CONFIG.locales];
    this.translationKeys = {
      'app.welcome': { hi: 'स्वागत है', en: 'Welcome', mr: 'सुस्वागतम्', gu: 'સ્વાગત છે' },
      'wish.card.title': { hi: 'शुभकामनाएं', en: 'Best Wishes', mr: 'हार्दिक शुभेच्छा', gu: 'શુભેચ્છાઓ' }
    };
  }

  getLocales() { return this.locales; }
  
  toggleLocaleStatus(code) {
    const item = this.locales.find(l => l.code === code);
    if (item) item.active = !item.active;
    return item;
  }

  getTranslationKeys() { return this.translationKeys; }
}

export const locCoreInstance = new LocalizationCore();
