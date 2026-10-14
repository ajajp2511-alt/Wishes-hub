/**
 * Main Assembly Controller - Analytics Intelligence Studio (Optimized & Upgraded)
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
    this.currentActiveModule = null;
  }

  init(rootId) {
    this.container = document.getElementById(rootId);
    if (!this.container) {
      console.error(`AnalyticsAssembly: Root container with ID '${rootId}' not found.`);
      return;
    }
    this.injectStyles();
    this.renderLayout();
    this.attachEventListeners();
  }

  injectStyles() {
    if (document.getElementById('analytics-assembly-styles')) return;
    const style = document.createElement('style');
    style.id = 'analytics-assembly-styles';
    style.innerHTML = `
      .analytics-container .tab-btn {
        background: #f6f8fa;
        border: 1px solid #e1e4e8;
        color: #24292e;
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .analytics-container .tab-btn:hover {
        background: #ebf0f4;
        border-color: #cbd6e2;
      }
      .analytics-container .tab-btn.active {
        background: #0366d6 !important;
        color: #ffffff !important;
        border-color: #0366d6 !important;
        font-weight: 600 !important;
      }
    `;
    document.head.appendChild(style);
  }

  renderLayout() {
    this.container.innerHTML = `
      <div class="analytics-container" style="padding:16px;">
        <header style="margin-bottom:20px;">
          <h2 style="margin:0; color: #24292e;">Analytics Intelligence Studio</h2>
          <small style="color:#586069;">Live Traffic, Generations, Geo Insights, Viral Prediction & Ad Revenue</small>
        </header>

        <nav style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:20px;">
          <button class="tab-btn ${this.activeSubTab === 'live-traffic' ? 'active' : ''}" data-subtab="live-traffic">Live Traffic</button>
          <button class="tab-btn ${this.activeSubTab === 'wish-generations' ? 'active' : ''}" data-subtab="wish-generations">Wish Generations</button>
          <button class="tab-btn ${this.activeSubTab === 'geo-insights' ? 'active' : ''}" data-subtab="geo-insights">Geographic Insights</button>
          <button class="tab-btn ${this.activeSubTab === 'predictive-viral' ? 'active' : ''}" data-subtab="predictive-viral">Predictive Analytics</button>
          <button class="tab-btn ${this.activeSubTab === 'share-attribution' ? 'active' : ''}" data-subtab="share-attribution">Share Attribution</button>
          <button class="tab-btn ${this.activeSubTab === 'ad-monetization' ? 'active' : ''}" data-subtab="ad-monetization">Ad Monetization</button>
          <button class="tab-btn ${this.activeSubTab === 'retention-cohorts' ? 'active' : ''}" data-subtab="retention-cohorts">User Retention</button>
          <button class="tab-btn ${this.activeSubTab === 'performance' ? 'active' : ''}" data-subtab="performance">Performance & CDN</button>
        </nav>

        <main id="analytics-main-view"></main>
      </div>
    `;

    this.renderActiveSubTab();
  }

  renderActiveSubTab() {
    const view = this.container.querySelector('#analytics-main-view');
    if (!view) return;

    try {
      // Cleanup previous module if destroy method exists
      if (this.currentActiveModule && typeof this.currentActiveModule.destroy === 'function') {
        this.currentActiveModule.destroy();
      }

      view.innerHTML = '';
      let moduleToRender = LiveTrafficModule;

      switch (this.activeSubTab) {
        case 'live-traffic': moduleToRender = LiveTrafficModule; break;
        case 'wish-generations': moduleToRender = WishGenerationsModule; break;
        case 'geo-insights': moduleToRender = GeographicInsightsModule; break;
        case 'predictive-viral': moduleToRender = PredictiveViralAnalyticsModule; break;
        case 'share-attribution': moduleToRender = ShareAttributionTrackerModule; break;
        case 'ad-monetization': moduleToRender = AdMonetizationAnalyticsModule; break;
        case 'retention-cohorts': moduleToRender = UserRetentionCohortsModule; break;
        case 'performance': moduleToRender = PerformanceMonitorModule; break;
        default: moduleToRender = LiveTrafficModule; break;
      }

      this.currentActiveModule = moduleToRender;
      if (typeof moduleToRender.render === 'function') {
        moduleToRender.render(view, analyticsCoreInstance);
      } else {
        throw new Error(`Analytics module for '${this.activeSubTab}' does not implement a static render() method.`);
      }

    } catch (error) {
      console.error("Error rendering analytics sub-tab:", error);
      view.innerHTML = `
        <div style="padding: 20px; background: #ffebe6; color: #de350b; border-radius: 6px; border: 1px solid #ffbdad;">
          <strong>Error Loading Analytics Module:</strong> Failed to render component. (${error.message})
        </div>
      `;
    }
  }

  attachEventListeners() {
    const navContainer = this.container.querySelector('nav');
    if (!navContainer) return;

    navContainer.addEventListener('click', (e) => {
      const targetBtn = e.target.closest('.tab-btn');
      if (!targetBtn) return;

      this.container.querySelectorAll('.tab-btn').forEach(b => {
        b.classList.remove('active');
      });
      
      targetBtn.classList.add('active');
      this.activeSubTab = targetBtn.dataset.subtab;
      this.renderActiveSubTab();
    });
  }
}

export const analyticsAssemblyInstance = new AnalyticsAssembly();

export function init(rootId) {
  analyticsAssemblyInstance.init(rootId);
}
