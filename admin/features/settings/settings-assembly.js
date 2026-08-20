/**
 * Main Assembly Controller - Settings
 * Path: admin/features/settings/settings-assembly.js
 */

import { settingsCoreInstance } from './settings-core.js';
import { SeoMetaConfigModule } from './modules/seo-meta-config.js';
import { AdsenseAdsManagerModule } from './modules/adsense-ads-manager.js';
import { ThemeCustomCssModule } from './modules/theme-custom-css.js';
import { LocalizationRegionModule } from './modules/localization-region.js';
import { EmailSmtpConfigModule } from './modules/email-smtp-config.js';
import { MaintenanceModeModule } from './modules/maintenance-mode.js';
import { SocialContactLinksModule } from './modules/social-contact-links.js';
import { PwaManifestConfigModule } from './modules/pwa-manifest-config.js';
import { StorageCdnManagerModule } from './modules/storage-cdn-manager.js';
import { SystemFeatureFlagsModule } from './modules/system-feature-flags.js';

export class SettingsAssembly {
  constructor() {
    this.container = null;
    this.activeSubTab = 'seo-meta';
  }

  init(rootId) {
    this.container = document.getElementById(rootId);
    if (!this.container) return;

    this.renderLayout();
    this.attachEventListeners();
  }

  renderLayout() {
    this.container.innerHTML = `
      <div class="settings-container" style="padding:16px;">
        <header style="margin-bottom:20px;">
          <h2 style="margin:0;">Global Platform Settings</h2>
          <small style="color:#6e7681;">SEO, Monetization, Theme Styling, Localization & Infrastructure Config</small>
        </header>

        <nav style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:20px;">
          <button class="tab-btn active" data-subtab="seo-meta">SEO & Meta</button>
          <button class="tab-btn" data-subtab="adsense">AdSense & Ads</button>
          <button class="tab-btn" data-subtab="theme">Theme & CSS</button>
          <button class="tab-btn" data-subtab="localization">Localization</button>
          <button class="tab-btn" data-subtab="email">Email & SMTP</button>
          <button class="tab-btn" data-subtab="maintenance">Maintenance Mode</button>
          <button class="tab-btn" data-subtab="social">Social Links</button>
          <button class="tab-btn" data-subtab="pwa">PWA Config</button>
          <button class="tab-btn" data-subtab="storage">Storage & CDN</button>
          <button class="tab-btn" data-subtab="flags">Feature Flags</button>
        </nav>

        <main id="settings-main-view"></main>
      </div>
    `;

    this.renderActiveSubTab();
  }

  renderActiveSubTab() {
    const view = this.container.querySelector('#settings-main-view');
    if (!view) return;

    switch (this.activeSubTab) {
      case 'seo-meta': SeoMetaConfigModule.render(view, settingsCoreInstance); break;
      case 'adsense': AdsenseAdsManagerModule.render(view, settingsCoreInstance); break;
      case 'theme': ThemeCustomCssModule.render(view, settingsCoreInstance); break;
      case 'localization': LocalizationRegionModule.render(view); break;
      case 'email': EmailSmtpConfigModule.render(view); break;
      case 'maintenance': MaintenanceModeModule.render(view); break;
      case 'social': SocialContactLinksModule.render(view); break;
      case 'pwa': PwaManifestConfigModule.render(view); break;
      case 'storage': StorageCdnManagerModule.render(view); break;
      case 'flags': SystemFeatureFlagsModule.render(view); break;
      default: SeoMetaConfigModule.render(view, settingsCoreInstance); break;
    }
  }

  attachEventListeners() {
    this.container.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.container.querySelectorAll('.tab-btn').forEach(b => {
          b.classList.remove('active');
          b.style.fontWeight = 'normal';
        });
        
        e.target.classList.add('active');
        e.target.style.fontWeight = 'bold';
        
        this.activeSubTab = e.target.dataset.subtab;
        this.renderActiveSubTab();
      });
    });
  }
}

export const settingsAssemblyInstance = new SettingsAssembly();
