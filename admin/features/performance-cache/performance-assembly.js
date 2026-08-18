/**
 * Main Assembly Controller - Performance & Cache
 * Path: admin/features/performance-cache/performance-assembly.js
 */

import { performanceCoreInstance } from './performance-core.js';
import { PurgeCdnCacheModule } from './modules/purge-cdn-cache.js';
import { ImageCompressionModule } from './modules/image-compression.js';
import { PageSpeedInsightsModule } from './modules/pagespeed-insights.js';
import { RedisMemoryCacheModule } from './modules/redis-memory-cache.js';
import { CriticalCssLazyloadModule } from './modules/critical-css-lazyload.js';
import { DbQueryCacheModule } from './modules/db-query-cache.js';
import { ServiceWorkerPwaModule } from './modules/service-worker-pwa.js';
import { EdgeScriptMinifierModule } from './modules/edge-script-minifier.js';
import { IsrStaticRevalidationModule } from './modules/isr-static-revalidation.js';
import { CdnBandwidthAnalyticsModule } from './modules/cdn-bandwidth-analytics.js';
import { DnsPrefetchPreloaderModule } from './modules/dns-prefetch-preloader.js';
import { DbPoolingRateLimiterModule } from './modules/db-pooling-rate-limiter.js';
import { FontSubsettingCacheModule } from './modules/font-subsetting-cache.js';
import { ApiPayloadCompressionModule } from './modules/api-payload-compression.js';

export class PerformanceAssembly {
  constructor() {
    this.container = null;
    this.activeSubTab = 'purge-cdn';
  }

  init(rootId) {
    this.container = document.getElementById(rootId);
    if (!this.container) return;

    this.renderLayout();
    this.attachEventListeners();
  }

  renderLayout() {
    this.container.innerHTML = `
      <div class="performance-manager-container" style="padding:16px;">
        <header style="margin-bottom:20px;">
          <h2 style="margin:0;">Performance & Cache Optimization Studio</h2>
          <small style="color:#6e7681;">CDN Purge, Media Compression, Speed Metrics & Edge Rules</small>
        </header>

        <nav style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:20px;">
          <button class="tab-btn active" data-subtab="purge-cdn">Purge CDN</button>
          <button class="tab-btn" data-subtab="image-comp">Image Compression</button>
          <button class="tab-btn" data-subtab="pagespeed">PageSpeed Insights</button>
          <button class="tab-btn" data-subtab="redis">Redis Cache</button>
          <button class="tab-btn" data-subtab="critical-css">Critical CSS</button>
          <button class="tab-btn" data-subtab="db-cache">DB Query Cache</button>
          <button class="tab-btn" data-subtab="pwa">PWA Offline</button>
          <button class="tab-btn" data-subtab="edge-minifier">Script Minifier</button>
          <button class="tab-btn" data-subtab="isr">ISR Revalidation</button>
          <button class="tab-btn" data-subtab="bandwidth">CDN Analytics</button>
          <button class="tab-btn" data-subtab="prefetch">DNS Prefetch</button>
          <button class="tab-btn" data-subtab="rate-limit">DB Rate Limiter</button>
          <button class="tab-btn" data-subtab="fonts">Font Cache</button>
          <button class="tab-btn" data-subtab="payload">API Compression</button>
        </nav>

        <main id="performance-main-view"></main>
      </div>
    `;

    this.renderActiveSubTab();
  }

  renderActiveSubTab() {
    const view = this.container.querySelector('#performance-main-view');
    if (!view) return;

    switch (this.activeSubTab) {
      case 'purge-cdn': PurgeCdnCacheModule.render(view, performanceCoreInstance); break;
      case 'image-comp': ImageCompressionModule.render(view); break;
      case 'pagespeed': PageSpeedInsightsModule.render(view, performanceCoreInstance); break;
      case 'redis': RedisMemoryCacheModule.render(view, performanceCoreInstance); break;
      case 'critical-css': CriticalCssLazyloadModule.render(view); break;
      case 'db-cache': DbQueryCacheModule.render(view); break;
      case 'pwa': ServiceWorkerPwaModule.render(view); break;
      case 'edge-minifier': EdgeScriptMinifierModule.render(view); break;
      case 'isr': IsrStaticRevalidationModule.render(view); break;
      case 'bandwidth': CdnBandwidthAnalyticsModule.render(view); break;
      case 'prefetch': DnsPrefetchPreloaderModule.render(view); break;
      case 'rate-limit': DbPoolingRateLimiterModule.render(view); break;
      case 'fonts': FontSubsettingCacheModule.render(view); break;
      case 'payload': ApiPayloadCompressionModule.render(view); break;
      default: PurgeCdnCacheModule.render(view, performanceCoreInstance); break;
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

export const performanceAssemblyInstance = new PerformanceAssembly();
