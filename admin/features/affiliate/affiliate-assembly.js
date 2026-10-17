/**
 * Module: Affiliate Marketing Engine - Assembly
 * Location: admin/features/affiliate/affiliate-assembly.js
 * Description: Master Assembly Controller & Boot Manager for Affiliate Module.
 */

import { AffiliateConfig } from './affiliate-config.js';
import { AffiliateCore } from './affiliate-core.js';
import { AffiliateApiSync } from './modules/affiliate-api-sync.js';
import { AffiliateDeepLink } from './modules/affiliate-deep-link.js';
import { AffiliateLinkCreator } from './modules/affiliate-link-creator.js';
import { AffiliateUiRenderer } from './modules/affiliate-ui-renderer.js';
import { AffiliateAnalytics } from './modules/affiliate-analytics.js';
import { AffiliateFestivalTagger } from './modules/affiliate-festival-tagger.js';
import { AffiliatePushNotifier } from './modules/affiliate-push-notifier.js';

class AffiliateAssembly {
  constructor() {
    this.config = AffiliateConfig;
    this.core = new AffiliateCore(this.config);
    this.modules = {};
  }

  async init() {
    console.log('[AffiliateAssembly] Booting Affiliate Engine...');
    
    // Core state initialize
    await this.core.init();

    // Sub-modules instantiation
    this.modules.apiSync = new AffiliateApiSync(this.core);
    this.modules.deepLink = new AffiliateDeepLink(this.core);
    this.modules.linkCreator = new AffiliateLinkCreator(this.core);
    this.modules.uiRenderer = new AffiliateUiRenderer(this.core);
    this.modules.analytics = new AffiliateAnalytics(this.core);
    this.modules.festivalTagger = new AffiliateFestivalTagger(this.core);
    this.modules.pushNotifier = new AffiliatePushNotifier(this.core);

    // Boot all sub-modules
    for (const [name, moduleInstance] of Object.entries(this.modules)) {
      if (typeof moduleInstance.init === 'function') {
        await moduleInstance.init();
        console.log(`[AffiliateAssembly] Sub-module loaded: ${name}`);
      }
    }

    console.log('[AffiliateAssembly] Affiliate Engine is live and operational.');
  }

  getModule(moduleName) {
    return this.modules[moduleName] || null;
  }
}

export const affiliateAssembly = new AffiliateAssembly();
