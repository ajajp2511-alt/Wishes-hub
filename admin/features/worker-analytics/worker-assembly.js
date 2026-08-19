/**
 * Main Assembly Controller - Worker Analytics
 * Path: admin/features/worker-analytics/worker-assembly.js
 */

import { workerCoreInstance } from './worker-core.js';
import { EdgeWorkerStatusModule } from './modules/edge-worker-status.js';
import { CachePerformanceModule } from './modules/cache-performance.js';
import { ErrorLogsModule } from './modules/error-logs.js';
import { RequestBandwidthVolumeModule } from './modules/request-bandwidth-volume.js';
import { CpuMemoryProfilerModule } from './modules/cpu-memory-profiler.js';
import { GeoTrafficLatencyModule } from './modules/geo-traffic-latency.js';
import { DeploymentRollbacksModule } from './modules/deployment-rollbacks.js';
import { KvSubrequestTrackerModule } from './modules/kv-subrequest-tracker.js';
import { ColdStartMonitorModule } from './modules/cold-start-monitor.js';
import { EdgeBotRateLimiterModule } from './modules/edge-bot-rate-limiter.js';

export class WorkerAssembly {
  constructor() {
    this.container = null;
    this.activeSubTab = 'worker-status';
  }

  init(rootId) {
    this.container = document.getElementById(rootId);
    if (!this.container) return;

    this.renderLayout();
    this.attachEventListeners();
  }

  renderLayout() {
    this.container.innerHTML = `
      <div class="worker-analytics-container" style="padding:16px;">
        <header style="margin-bottom:20px;">
          <h2 style="margin:0;">Worker Analytics Studio</h2>
          <small style="color:#6e7681;">Edge Worker Health, Cache Offload, Execution Profiler & Error Monitoring</small>
        </header>

        <nav style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:20px;">
          <button class="tab-btn active" data-subtab="worker-status">Worker Status</button>
          <button class="tab-btn" data-subtab="cache-perf">Cache Performance</button>
          <button class="tab-btn" data-subtab="errors">Error Logs</button>
          <button class="tab-btn" data-subtab="bandwidth">Request Volume</button>
          <button class="tab-btn" data-subtab="cpu-memory">CPU & Memory</button>
          <button class="tab-btn" data-subtab="geo">Geo Distribution</button>
          <button class="tab-btn" data-subtab="rollbacks">Deployments</button>
          <button class="tab-btn" data-subtab="kv-ops">KV & Subrequests</button>
          <button class="tab-btn" data-subtab="cold-start">Cold Starts</button>
          <button class="tab-btn" data-subtab="bot-limiter">Bot & Rate Limits</button>
        </nav>

        <main id="worker-main-view"></main>
      </div>
    `;

    this.renderActiveSubTab();
  }

  renderActiveSubTab() {
    const view = this.container.querySelector('#worker-main-view');
    if (!view) return;

    switch (this.activeSubTab) {
      case 'worker-status': EdgeWorkerStatusModule.render(view, workerCoreInstance); break;
      case 'cache-perf': CachePerformanceModule.render(view, workerCoreInstance); break;
      case 'errors': ErrorLogsModule.render(view, workerCoreInstance); break;
      case 'bandwidth': RequestBandwidthVolumeModule.render(view); break;
      case 'cpu-memory': CpuMemoryProfilerModule.render(view); break;
      case 'geo': GeoTrafficLatencyModule.render(view); break;
      case 'rollbacks': DeploymentRollbacksModule.render(view); break;
      case 'kv-ops': KvSubrequestTrackerModule.render(view); break;
      case 'cold-start': ColdStartMonitorModule.render(view); break;
      case 'bot-limiter': EdgeBotRateLimiterModule.render(view); break;
      default: EdgeWorkerStatusModule.render(view, workerCoreInstance); break;
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

export const workerAssemblyInstance = new WorkerAssembly();
