/**
 * Main Assembly Controller - System Logs
 * Path: admin/features/system-logs/logs-assembly.js
 */

import { logsCoreInstance } from './logs-core.js';
import { AdminAuditLogModule } from './modules/admin-audit-log.js';
import { DatabaseBackupsModule } from './modules/database-backups.js';
import { ApiCrashLogsModule } from './modules/api-crash-logs.js';
import { LogExportStreamerModule } from './modules/log-export-streamer.js';
import { SecurityAuthLogsModule } from './modules/security-auth-logs.js';
import { BackupRestoreSimulatorModule } from './modules/backup-restore-simulator.js';
import { LogAlertTriggersModule } from './modules/log-alert-triggers.js';
import { CronJobTaskLogsModule } from './modules/cron-job-task-logs.js';
import { SlowQueryPerformanceLogsModule } from './modules/slow-query-performance-logs.js';
import { SensitiveDataRedactorModule } from './modules/sensitive-data-redactor.js';

export class LogsAssembly {
  constructor() {
    this.container = null;
    this.activeSubTab = 'audit-log';
  }

  init(rootId) {
    this.container = document.getElementById(rootId);
    if (!this.container) return;

    this.renderLayout();
    this.attachEventListeners();
  }

  renderLayout() {
    this.container.innerHTML = `
      <div class="logs-container" style="padding:16px;">
        <header style="margin-bottom:20px;">
          <h2 style="margin:0;">System Logs & Observability Hub</h2>
          <small style="color:#6e7681;">Admin Audits, Database Backups, Crash Diagnostics & Performance Tracing</small>
        </header>

        <nav style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:20px;">
          <button class="tab-btn active" data-subtab="audit-log">Admin Audit Log</button>
          <button class="tab-btn" data-subtab="backups">Database Backups</button>
          <button class="tab-btn" data-subtab="crashes">API & Crash Logs</button>
          <button class="tab-btn" data-subtab="streamer">Log Streamer</button>
          <button class="tab-btn" data-subtab="auth-logs">Security Logs</button>
          <button class="tab-btn" data-subtab="restore-sim">Restore Simulator</button>
          <button class="tab-btn" data-subtab="alerts">Search & Alerts</button>
          <button class="tab-btn" data-subtab="cron">Cron Task Logs</button>
          <button class="tab-btn" data-subtab="slow-queries">Slow Queries</button>
          <button class="tab-btn" data-subtab="redactor">PII Redactor</button>
        </nav>

        <main id="logs-main-view"></main>
      </div>
    `;

    this.renderActiveSubTab();
  }

  renderActiveSubTab() {
    const view = this.container.querySelector('#logs-main-view');
    if (!view) return;

    switch (this.activeSubTab) {
      case 'audit-log': AdminAuditLogModule.render(view, logsCoreInstance); break;
      case 'backups': DatabaseBackupsModule.render(view, logsCoreInstance); break;
      case 'crashes': ApiCrashLogsModule.render(view, logsCoreInstance); break;
      case 'streamer': LogExportStreamerModule.render(view); break;
      case 'auth-logs': SecurityAuthLogsModule.render(view); break;
      case 'restore-sim': BackupRestoreSimulatorModule.render(view); break;
      case 'alerts': LogAlertTriggersModule.render(view); break;
      case 'cron': CronJobTaskLogsModule.render(view); break;
      case 'slow-queries': SlowQueryPerformanceLogsModule.render(view); break;
      case 'redactor': SensitiveDataRedactorModule.render(view); break;
      default: AdminAuditLogModule.render(view, logsCoreInstance); break;
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

export const logsAssemblyInstance = new LogsAssembly();
