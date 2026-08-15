/**
 * Main Assembly Controller - Localization & Languages
 * Path: admin/features/localization/loc-assembly.js
 */

import { locCoreInstance } from './loc-core.js';
import { ActiveLanguagesModule } from './modules/active-languages.js';
import { TranslationKeysModule } from './modules/translation-keys.js';
import { RegionalFestivalCalendarModule } from './modules/regional-festival-calendar.js';
import { GeoLocaleRouterModule } from './modules/geo-locale-router.js';
import { RegionalFontOptimizerModule } from './modules/regional-font-optimizer.js';
import { CulturalSensitivityShieldModule } from './modules/cultural-sensitivity-shield.js';

export class LocalizationAssembly {
  constructor() {
    this.container = null;
    this.activeSubTab = 'active-languages';
  }

  init(rootId) {
    this.container = document.getElementById(rootId);
    if (!this.container) return;

    this.renderLayout();
    this.attachEventListeners();
  }

  renderLayout() {
    this.container.innerHTML = `
      <div class="loc-container" style="padding:16px;">
        <header style="margin-bottom:20px;">
          <h2 style="margin:0;">Localization & Languages Studio</h2>
          <small style="color:#6e7681;">i18n Keys, Active Locales, Geo-IP Router & Regional Calendar</small>
        </header>

        <nav style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:20px;">
          <button class="tab-btn active" data-subtab="active-languages">Active Languages</button>
          <button class="tab-btn" data-subtab="translation-keys">Translation Keys</button>
          <button class="tab-btn" data-subtab="regional-calendar">Regional Calendar</button>
          <button class="tab-btn" data-subtab="geo-router">Geo-IP Router</button>
          <button class="tab-btn" data-subtab="font-optimizer">Font Optimizer</button>
          <button class="tab-btn" data-subtab="cultural-shield">Cultural Shield</button>
        </nav>

        <main id="loc-main-view"></main>
      </div>
    `;

    this.renderActiveSubTab();
  }

  renderActiveSubTab() {
    const view = this.container.querySelector('#loc-main-view');
    if (!view) return;

    switch (this.activeSubTab) {
      case 'active-languages': ActiveLanguagesModule.render(view, locCoreInstance); break;
      case 'translation-keys': TranslationKeysModule.render(view, locCoreInstance); break;
      case 'regional-calendar': RegionalFestivalCalendarModule.render(view); break;
      case 'geo-router': GeoLocaleRouterModule.render(view); break;
      case 'font-optimizer': RegionalFontOptimizerModule.render(view); break;
      case 'cultural-shield': CulturalSensitivityShieldModule.render(view); break;
      default: ActiveLanguagesModule.render(view, locCoreInstance); break;
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

export const localizationAssemblyInstance = new LocalizationAssembly();
