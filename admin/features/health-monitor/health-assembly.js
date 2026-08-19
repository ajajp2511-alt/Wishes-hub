/**
 * Main Assembly Controller - Health & System Monitor
 * Path: admin/features/health-monitor/health-assembly.js
 */

import { healthCoreInstance } from './health-core.js';
import { ServerCdnStatusModule } from './modules/server-cdn-status.js';
import { DbHealthLoadModule } from './modules/db-health-load.js';
import { SystemAlertsWebhooksModule } from './modules/system-alerts-webhooks.js';
import { ErrorExceptionTrackerModule } from './modules/error-exception-tracker.js';
import { ApiEndpointPingerModule } from './modules/api-endpoint-pinger.js';
import { SslDomainHealthModule } from './modules/ssl-domain-health.js';
import { MemoryEventloopMonitorModule } from './modules/memory-eventloop-monitor.js';
import { IncidentStatusPageModule } from './modules/incident-status-page.js';
import { ThirdPartyApiTrackerModule } from './modules/third-party-api-tracker.js';
import { TrafficSpikeAutoscaleModule } from './modules/traffic-spike-autoscale.js';
import { DiskLogRotationModule } from './modules/disk-log-rotation.js';
import { CronJobHealthModule } from './modules/cron-job-health.js';

export class HealthAssembly {
  constructor() {
    this.container = null;
    this.activeSubTab = 'server-cdn';
  }

  init(rootId) {
    this.container = document.getElementById(rootId);
    if (!this.container) return;

    this.renderLayout();
    this.attachEventListeners();
  }

  renderLayout() {
    this.container.innerHTML = `
      <div class="health-manager-container" style="padding:16px;">
        <header style="margin-bottom:20px;">
          <h2 style="margin:0;">Health & System Monitoring Hub</h2>
          <small style="color:#6e7681;">Server Uptime, DB Load, Error Logs & Automated Incident Alerts</small>
        </header>

        <nav style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:20px;">
          <button class="tab-btn active" data-subtab="server-cdn">Server & CDN</button>
          <button class="tab-btn" data-subtab="db-health">DB Health</button>
          <button class="tab-btn" data-subtab="alerts">Alerts & Webhooks</button>
          <button class="tab-btn" data-subtab="errors">Error Tracker</button>
          <button class="tab-btn" data-subtab="pinger">API Pinger</button>
          <button class="tab-btn" data-subtab="ssl">SSL & Domain</button>
          <button class="tab-btn" data-subtab="memory">Memory & Loop</button>
          <button class="tab-btn" data-subtab="status-page">Status Page</button>
          <button class="tab-btn" data-subtab="third-party">3rd-Party APIs</button>
          <button class="tab-btn" data-subtab="autoscale">Auto-Scaling</button>
          <button class="tab-btn" data-subtab="disk-logs">Disk & Logs</button>
          <button class="tab-btn" data-subtab="cron">Cron Workers</button>
        </nav>

        <main id="health-main-view"></main>
      </div>
    `;

    this.renderActiveSubTab();
  }

  renderActiveSubTab() {
    const view = this.container.querySelector('#health-main-view');
    if (!view) return;

    switch (this.activeSubTab) {
      case 'server-cdn': ServerCdnStatusModule.render(view, healthCoreInstance); break;
      case 'db-health': DbHealthLoadModule.render(view, healthCoreInstance); break;
      case 'alerts': SystemAlertsWebhooksModule.render(view, healthCoreInstance); break;
      case 'errors': ErrorExceptionTrackerModule.render(view); break;
      case 'pinger': ApiEndpointPingerModule.render(view); break;
      case 'ssl': SslDomainHealthModule.render(view); break;
      case 'memory': MemoryEventloopMonitorModule.render(view); break;
      case 'status-page': IncidentStatusPageModule.render(view); break;
      case 'third-party': ThirdPartyApiTrackerModule.render(view); break;
      case 'autoscale': TrafficSpikeAutoscaleModule.render(view); break;
      case 'disk-logs': DiskLogRotationModule.render(view); break;
      case 'cron': CronJobHealthModule.render(view); break;
      default: ServerCdnStatusModule.render(view, healthCoreInstance); break;
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

export const healthAssemblyInstance = new HealthAssembly();
