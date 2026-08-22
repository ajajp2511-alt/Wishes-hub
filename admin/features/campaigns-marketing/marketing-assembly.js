/**
 * Main Assembly Controller - Campaigns & Marketing
 * Path: admin/features/campaigns-marketing/marketing-assembly.js
 */

import { marketingCoreInstance } from './marketing-core.js';
import { FestivalSchedulerModule } from './modules/festival-scheduler.js';
import { BotsBroadcastModule } from './modules/bots-broadcast.js';
import { EmailNewslettersModule } from './modules/email-newsletters.js';
import { AbTestingAiModule } from './modules/ab-testing-ai.js';
import { LinkTrackingUtmModule } from './modules/link-tracking-utm.js';
import { RetargetingPopupsModule } from './modules/retargeting-popups.js';

export class MarketingAssembly {
  constructor() {
    this.container = null;
    this.activeSubTab = 'festival-scheduler';
  }

  init(rootId) {
    this.container = document.getElementById(rootId);
    if (!this.container) return;

    this.renderLayout();
    this.attachEventListeners();
  }

  renderLayout() {
    this.container.innerHTML = `
      <div class="marketing-container" style="padding:16px;">
        <header style="margin-bottom:20px;">
          <h2 style="margin:0;">Campaigns & Marketing Engine</h2>
          <small style="color:#6e7681;">Scheduler, Bots, Email, AI Copy & Tracking</small>
        </header>

        <nav style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:20px;">
          <button class="tab-btn active" data-subtab="festival-scheduler">Festival Scheduler</button>
          <button class="tab-btn" data-subtab="bots-broadcast">WhatsApp & Telegram Bots</button>
          <button class="tab-btn" data-subtab="email-newsletters">Email Newsletters</button>
          <button class="tab-btn" data-subtab="ab-testing-ai">A/B Test & AI</button>
          <button class="tab-btn" data-subtab="link-tracking-utm">UTM & Short Links</button>
          <button class="tab-btn" data-subtab="retargeting-popups">Retargeting Popups</button>
        </nav>

        <main id="marketing-main-view"></main>
      </div>
    `;

    this.renderActiveSubTab();
  }

  renderActiveSubTab() {
    const view = this.container.querySelector('#marketing-main-view');
    if (!view) return;

    switch (this.activeSubTab) {
      case 'festival-scheduler': FestivalSchedulerModule.render(view, marketingCoreInstance); break;
      case 'bots-broadcast': BotsBroadcastModule.render(view, marketingCoreInstance); break;
      case 'email-newsletters': EmailNewslettersModule.render(view); break;
      case 'ab-testing-ai': AbTestingAiModule.render(view); break;
      case 'link-tracking-utm': LinkTrackingUtmModule.render(view, marketingCoreInstance); break;
      case 'retargeting-popups': RetargetingPopupsModule.render(view); break;
      default: FestivalSchedulerModule.render(view, marketingCoreInstance); break;
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

export const marketingAssemblyInstance = new MarketingAssembly();
