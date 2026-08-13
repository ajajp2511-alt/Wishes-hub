/**
 * Main Assembly Controller - Marketplace & Creators
 * Path: admin/features/marketplace-creators/marketplace-assembly.js
 */

import { marketplaceCoreInstance } from './marketplace-core.js';
import { PremiumStoreModule } from './modules/premium-store.js';
import { CreatorSubmissionsModule } from './modules/creator-submissions.js';
import { PayoutsCommissionsModule } from './modules/payouts-commissions.js';
import { KycVerificationModule } from './modules/kyc-verification.js';
import { CreatorAnalyticsModule } from './modules/creator-analytics.js';
import { CopyrightShieldModule } from './modules/copyright-shield.js';
import { B2bRequestsModule } from './modules/b2b-requests.js';
import { SponsorshipAdsModule } from './modules/sponsorship-ads.js';
import { CoAuthorshipModule } from './modules/co-authorship.js';

export class MarketplaceAssembly {
  constructor() {
    this.container = null;
    this.activeSubTab = 'premium-store';
  }

  init(rootId) {
    this.container = document.getElementById(rootId);
    if (!this.container) return;

    this.renderLayout();
    this.attachEventListeners();
  }

  renderLayout() {
    this.container.innerHTML = `
      <div class="marketplace-container" style="padding:16px;">
        <header style="margin-bottom:20px;">
          <h2 style="margin:0;">Marketplace & Creators Hub</h2>
          <small style="color:#6e7681;">Templates, Approvals, Payouts & DRM Shield</small>
        </header>

        <nav style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:20px;">
          <button class="tab-btn active" data-subtab="premium-store">Store & Pricing</button>
          <button class="tab-btn" data-subtab="creator-submissions">Submissions</button>
          <button class="tab-btn" data-subtab="payouts-commissions">Payouts & Splits</button>
          <button class="tab-btn" data-subtab="kyc-verification">KYC Shield</button>
          <button class="tab-btn" data-subtab="creator-analytics">Analytics</button>
          <button class="tab-btn" data-subtab="copyright-shield">DRM Shield</button>
          <button class="tab-btn" data-subtab="b2b-requests">B2B Orders</button>
          <button class="tab-btn" data-subtab="sponsorship-ads">Brand Ads</button>
          <button class="tab-btn" data-subtab="co-authorship">Co-Authorship</button>
        </nav>

        <main id="marketplace-main-view"></main>
      </div>
    `;

    this.renderActiveSubTab();
  }

  renderActiveSubTab() {
    const view = this.container.querySelector('#marketplace-main-view');
    if (!view) return;

    switch (this.activeSubTab) {
      case 'premium-store': PremiumStoreModule.render(view, marketplaceCoreInstance); break;
      case 'creator-submissions': CreatorSubmissionsModule.render(view, marketplaceCoreInstance); break;
      case 'payouts-commissions': PayoutsCommissionsModule.render(view, marketplaceCoreInstance); break;
      case 'kyc-verification': KycVerificationModule.render(view, marketplaceCoreInstance); break;
      case 'creator-analytics': CreatorAnalyticsModule.render(view); break;
      case 'copyright-shield': CopyrightShieldModule.render(view); break;
      case 'b2b-requests': B2bRequestsModule.render(view); break;
      case 'sponsorship-ads': SponsorshipAdsModule.render(view); break;
      case 'co-authorship': CoAuthorshipModule.render(view); break;
      default: PremiumStoreModule.render(view, marketplaceCoreInstance); break;
    }
  }

  attachEventListeners() {
    this.container.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.container.querySelectorAll('.tab-btn').forEach(b => b.style.fontWeight = 'normal');
        e.target.style.fontWeight = 'bold';
        this.activeSubTab = e.target.dataset.subtab;
        this.renderActiveSubTab();
      });
    });

    this.container.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-approve')) {
        const id = e.target.dataset.id;
        marketplaceCoreInstance.approveSubmission(id);
        this.renderActiveSubTab();
      }

      if (e.target.classList.contains('btn-payout')) {
        const creator = e.target.dataset.creator;
        marketplaceCoreInstance.processPayout(creator);
        this.renderActiveSubTab();
      }
    });
  }
}

export const marketplaceAssemblyInstance = new MarketplaceAssembly();
