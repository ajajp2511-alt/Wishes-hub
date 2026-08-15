/**
 * Main Assembly Controller - Analytics
 * Path: admin/features/analytics/analytics-assembly.js
 */

import { analyticsCoreInstance } from './analytics-core.js';
import { LiveTrafficModule } from './modules/live-traffic.js';
import { WishGenerationsModule } from './modules/wish-generations.js';
import { GeographicInsightsModule } from './modules/geographic-insights.js';
import { PredictiveViralAnalyticsModule } from './modules/predictive-viral-analytics.js';
import { ShareAttributionTrackerModule } from './modules/share-attribution-tracker.js';
import { AdMonetizationAnalyticsModule } from './modules/ad-monetization-analytics.js';
import { UserRetentionCohortsModule } from './modules/user-retention-cohorts.js';
import { PerformanceMonitorModule } from './modules/performance-monitor.js';

export class AnalyticsAssembly {
  constructor() {
    this.container = null;
    this.activeSubTab = 'live-traffic';
  }

  init(rootId) {
    this.container = document.getElementById(rootId);
    if (!this.container) return;

    this.renderLayout();
    this.attachEventListeners();
  }

  renderLayout() {
    this.container.innerHTML = `
      <div class="analytics-container" style="padding:16px;">
        <header style="margin-bottom:20px;">
          <h2 style="margin:0;">Analytics Intelligence Studio</h2>
          <small style="color:#6e7681;">Live Traffic, Generations, Geo Insights, Viral Prediction & Ad Revenue</small>
        </header>

        <nav style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:20px;">
          <button class="tab-btn active" data-subtab="live-traffic">Live Traffic</button>
          <button class="tab-btn" data-subtab="wish-generations">Wish Generations</button>
          <button class="tab-btn" data-subtab="geo-insights">Geographic Insights</button>
          <button class="tab-btn" data-subtab="predictive-viral">Predictive Analytics</button>
          <button class="tab-btn" data-subtab="share-attribution">Share Attribution</button>
          <button class="tab-btn" data-subtab="ad-monetization">Ad Monetization</button>
          <button class="tab-btn" data-subtab="retention-cohorts">User Retention</button>
          <button class="tab-btn" data-subtab="performance">Performance & CDN</button>
        </nav>

        <main id="analytics-main-view"></main>
      </div>
    `;

    this.renderActiveSubTab();
  }

  renderActiveSubTab() {
    const view = this.container.querySelector('#analytics-main-view');
    if (!view) return;

    switch (this.activeSubTab) {
      case 'live-traffic': LiveTrafficModule.render(view, analyticsCoreInstance); break;
      case 'wish-generations': WishGenerationsModule.render(view, analyticsCoreInstance); break;
      case 'geo-insights': GeographicInsightsModule.render(view, analyticsCoreInstance); break;
      case 'predictive-viral': PredictiveViralAnalyticsModule.render(view); break;
      case 'share-attribution': ShareAttributionTrackerModule.render(view, analyticsCoreInstance); break;
      case 'ad-monetization': AdMonetizationAnalyticsModule.render(view, analyticsCoreInstance); break;
      case 'retention-cohorts': UserRetentionCohortsModule.render(view); break;
      case 'performance': PerformanceMonitorModule.render(view); break;
      default: LiveTrafficModule.render(view, analyticsCoreInstance); break;
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

export const analyticsAssemblyInstance = new AnalyticsAssembly();
