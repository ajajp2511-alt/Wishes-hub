/**
 * Main Assembly Controller - Trending Engine
 * Path: admin/features/trending/trending-assembly.js
 */

import { trendingCoreInstance } from './trending-core.js';
import { HomepageHeroModule } from './modules/homepage-hero.js';
import { FestiveCountdownModule } from './modules/festive-countdown.js';
import { ViralScoreboardModule } from './modules/viral-scoreboard.js';
import { AutoPromoteRulesModule } from './modules/auto-promote-rules.js';
import { GeoTrendingFilterModule } from './modules/geo-trending-filter.js';
import { TrendingPushAlertsModule } from './modules/trending-push-alerts.js';
import { SocialTrendIngestionModule } from './modules/social-trend-ingestion.js';
import { HeroAbSwitcherModule } from './modules/hero-ab-switcher.js';
import { TimeDecayRankerModule } from './modules/time-decay-ranker.js';
import { FlashTrendDetectorModule } from './modules/flash-trend-detector.js';
import { PersonalizedTrendingFeedModule } from './modules/personalized-trending-feed.js';
import { AutoArchiveBannersModule } from './modules/auto-archive-banners.js';
import { FomoUrgencyTriggersModule } from './modules/fomo-urgency-triggers.js';
import { SeasonalAiPredictorModule } from './modules/seasonal-ai-predictor.js';
import { CrossPlatformMultiplierModule } from './modules/cross-platform-multiplier.js';
import { InfluencerTrendTrackerModule } from './modules/influencer-trend-tracker.js';
import { LoadBalancerTrafficGuardModule } from './modules/load-balancer-traffic-guard.js';

export class TrendingAssembly {
  constructor() {
    this.container = null;
    this.activeSubTab = 'homepage-hero';
  }

  init(rootId) {
    this.container = document.getElementById(rootId);
    if (!this.container) return;

    this.renderLayout();
    this.attachEventListeners();
  }

  renderLayout() {
    this.container.innerHTML = `
      <div class="trending-container" style="padding:16px;">
        <header style="margin-bottom:20px;">
          <h2 style="margin:0;">Trending & Viral Engine Studio</h2>
          <small style="color:#6e7681;">Hero Banners, Countdowns, Leaderboards, AI Predictors & Dynamic Ranking</small>
        </header>

        <nav style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:20px;">
          <button class="tab-btn active" data-subtab="homepage-hero">Homepage Hero</button>
          <button class="tab-btn" data-subtab="festive-countdown">Festive Countdown</button>
          <button class="tab-btn" data-subtab="viral-scoreboard">Viral Scoreboard</button>
          <button class="tab-btn" data-subtab="auto-promote">Auto Promote</button>
          <button class="tab-btn" data-subtab="geo-trending">Geo Filter</button>
          <button class="tab-btn" data-subtab="push-alerts">Push Alerts</button>
          <button class="tab-btn" data-subtab="social-ingestion">Social Trends</button>
          <button class="tab-btn" data-subtab="ab-switcher">Hero A/B</button>
          <button class="tab-btn" data-subtab="time-decay">Time Decay</button>
          <button class="tab-btn" data-subtab="flash-detector">Flash Detector</button>
          <button class="tab-btn" data-subtab="personalized-feed">Personalized Feed</button>
          <button class="tab-btn" data-subtab="auto-archive">Auto Archive</button>
          <button class="tab-btn" data-subtab="fomo-triggers">FOMO Badges</button>
          <button class="tab-btn" data-subtab="ai-predictor">AI Demand</button>
          <button class="tab-btn" data-subtab="cross-platform">Multi-Channel</button>
          <button class="tab-btn" data-subtab="influencer-tracker">Influencer Spike</button>
          <button class="tab-btn" data-subtab="load-guard">Traffic Guard</button>
        </nav>

        <main id="trending-main-view"></main>
      </div>
    `;

    this.renderActiveSubTab();
  }

  renderActiveSubTab() {
    const view = this.container.querySelector('#trending-main-view');
    if (!view) return;

    switch (this.activeSubTab) {
      case 'homepage-hero': HomepageHeroModule.render(view, trendingCoreInstance); break;
      case 'festive-countdown': FestiveCountdownModule.render(view, trendingCoreInstance); break;
      case 'viral-scoreboard': ViralScoreboardModule.render(view, trendingCoreInstance); break;
      case 'auto-promote': AutoPromoteRulesModule.render(view); break;
      case 'geo-trending': GeoTrendingFilterModule.render(view); break;
      case 'push-alerts': TrendingPushAlertsModule.render(view); break;
      case 'social-ingestion': SocialTrendIngestionModule.render(view); break;
      case 'ab-switcher': HeroAbSwitcherModule.render(view); break;
      case 'time-decay': TimeDecayRankerModule.render(view); break;
      case 'flash-detector': FlashTrendDetectorModule.render(view); break;
      case 'personalized-feed': PersonalizedTrendingFeedModule.render(view); break;
      case 'auto-archive': AutoArchiveBannersModule.render(view); break;
      case 'fomo-triggers': FomoUrgencyTriggersModule.render(view); break;
      case 'ai-predictor': SeasonalAiPredictorModule.render(view); break;
      case 'cross-platform': CrossPlatformMultiplierModule.render(view); break;
      case 'influencer-tracker': InfluencerTrendTrackerModule.render(view); break;
      case 'load-guard': LoadBalancerTrafficGuardModule.render(view); break;
      default: HomepageHeroModule.render(view, trendingCoreInstance); break;
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

export const trendingAssemblyInstance = new TrendingAssembly();
