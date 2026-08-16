/**
 * Main Assembly Controller - Monetization & Ads
 * Path: admin/features/monetization/monetization-assembly.js
 */

import { monetizationCoreInstance } from './monetization-core.js';
import { AdsPlacementsModule } from './modules/ads-placements.js';
import { CustomBannerAdsModule } from './modules/custom-banner-ads.js';
import { RevenueDashboardModule } from './modules/revenue-dashboard.js';
import { AdblockDetectorBypassModule } from './modules/adblock-detector-bypass.js';
import { LazyLoadAdEngineModule } from './modules/lazy-load-ad-engine.js';
import { HeaderBiddingFallbackModule } from './modules/header-bidding-fallback.js';
import { AffiliateCouponManagerModule } from './modules/affiliate-coupon-manager.js';
import { InterstitialRewardedAdsModule } from './modules/interstitial-rewarded-ads.js';
import { GeoAdRouterModule } from './modules/geo-ad-router.js';
import { CardEmbeddedSponsorsModule } from './modules/card-embedded-sponsors.js';
import { CampaignSchedulerModule } from './modules/campaign-scheduler.js';
import { FrequencyCappingGuardModule } from './modules/frequency-capping-guard.js';
import { AdFraudProtectionModule } from './modules/ad-fraud-protection.js';
import { NativeFeedInjectorModule } from './modules/native-feed-injector.js';
import { AutoRefreshAdSlotsModule } from './modules/auto-refresh-ad-slots.js';

export class MonetizationAssembly {
  constructor() {
    this.container = null;
    this.activeSubTab = 'ads-placements';
  }

  init(rootId) {
    this.container = document.getElementById(rootId);
    if (!this.container) return;

    this.renderLayout();
    this.attachEventListeners();
  }

  renderLayout() {
    this.container.innerHTML = `
      <div class="monetization-container" style="padding:16px;">
        <header style="margin-bottom:20px;">
          <h2 style="margin:0;">Monetization & Ads Management Studio</h2>
          <small style="color:#6e7681;">Ad Placements, Sponsor Banners, Revenue Analytics & Fraud Protection</small>
        </header>

        <nav style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:20px;">
          <button class="tab-btn active" data-subtab="ads-placements">Ads Placements</button>
          <button class="tab-btn" data-subtab="custom-banner">Custom Banners</button>
          <button class="tab-btn" data-subtab="revenue-dashboard">Revenue Analytics</button>
          <button class="tab-btn" data-subtab="adblock-bypass">AdBlock Bypass</button>
          <button class="tab-btn" data-subtab="lazy-load">Lazy Loading</button>
          <button class="tab-btn" data-subtab="header-bidding">Waterfall Routing</button>
          <button class="tab-btn" data-subtab="affiliate-coupons">Affiliate Coupons</button>
          <button class="tab-btn" data-subtab="interstitials">Interstitial Ads</button>
          <button class="tab-btn" data-subtab="geo-router">Geo Router</button>
          <button class="tab-btn" data-subtab="card-sponsors">Card Watermarks</button>
          <button class="tab-btn" data-subtab="scheduler">Campaign Scheduler</button>
          <button class="tab-btn" data-subtab="frequency-cap">Frequency Cap</button>
          <button class="tab-btn" data-subtab="fraud-protection">Fraud Protection</button>
          <button class="tab-btn" data-subtab="native-injector">In-Feed Injector</button>
          <button class="tab-btn" data-subtab="auto-refresh">Auto Refresh</button>
        </nav>

        <main id="monetization-main-view"></main>
      </div>
    `;

    this.renderActiveSubTab();
  }

  renderActiveSubTab() {
    const view = this.container.querySelector('#monetization-main-view');
    if (!view) return;

    switch (this.activeSubTab) {
      case 'ads-placements': AdsPlacementsModule.render(view, monetizationCoreInstance); break;
      case 'custom-banner': CustomBannerAdsModule.render(view, monetizationCoreInstance); break;
      case 'revenue-dashboard': RevenueDashboardModule.render(view, monetizationCoreInstance); break;
      case 'adblock-bypass': AdblockDetectorBypassModule.render(view); break;
      case 'lazy-load': LazyLoadAdEngineModule.render(view); break;
      case 'header-bidding': HeaderBiddingFallbackModule.render(view); break;
      case 'affiliate-coupons': AffiliateCouponManagerModule.render(view); break;
      case 'interstitials': InterstitialRewardedAdsModule.render(view); break;
      case 'geo-router': GeoAdRouterModule.render(view); break;
      case 'card-sponsors': CardEmbeddedSponsorsModule.render(view); break;
      case 'scheduler': CampaignSchedulerModule.render(view); break;
      case 'frequency-cap': FrequencyCappingGuardModule.render(view); break;
      case 'fraud-protection': AdFraudProtectionModule.render(view); break;
      case 'native-injector': NativeFeedInjectorModule.render(view); break;
      case 'auto-refresh': AutoRefreshAdSlotsModule.render(view); break;
      default: AdsPlacementsModule.render(view, monetizationCoreInstance); break;
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

export const monetizationAssemblyInstance = new MonetizationAssembly();
