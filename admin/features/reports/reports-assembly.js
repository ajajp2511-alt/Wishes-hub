/**
 * Main Assembly Controller - Reports & Export
 * Path: admin/features/reports/reports-assembly.js
 */

import { reportsCoreInstance } from './reports-core.js';
import { ReportGeneratorModule } from './modules/report-generator.js';
import { AutomatedEmailReportsModule } from './modules/automated-email-reports.js';
import { CsvExcelDownloadsModule } from './modules/csv-excel-downloads.js';
import { PdfDashboardBuilderModule } from './modules/pdf-dashboard-builder.js';
import { CloudBackupSyncModule } from './modules/cloud-backup-sync.js';
import { ExportAuditLogsModule } from './modules/export-audit-logs.js';
import { AiReportSummaryModule } from './modules/ai-report-summary.js';
import { RoleExportControlModule } from './modules/role-export-control.js';
import { TelegramSlackWebhookModule } from './modules/telegram-slack-webhook.js';
import { DataRetentionArchiverModule } from './modules/data-retention-archiver.js';

export class ReportsAssembly {
  constructor() {
    this.container = null;
    this.activeSubTab = 'report-generator';
  }

  init(rootId) {
    this.container = document.getElementById(rootId);
    if (!this.container) return;

    this.renderLayout();
    this.attachEventListeners();
  }

  renderLayout() {
    this.container.innerHTML = `
      <div class="reports-container" style="padding:16px;">
        <header style="margin-bottom:20px;">
          <h2 style="margin:0;">Reports & Data Export Studio</h2>
          <small style="color:#6e7681;">Custom Reports, Email Scheduling, Raw Exports, Cloud Backups & Webhooks</small>
        </header>

        <nav style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:20px;">
          <button class="tab-btn active" data-subtab="report-generator">Report Generator</button>
          <button class="tab-btn" data-subtab="email-reports">Email Reports</button>
          <button class="tab-btn" data-subtab="csv-downloads">CSV/Excel Exports</button>
          <button class="tab-btn" data-subtab="pdf-builder">PDF Builder</button>
          <button class="tab-btn" data-subtab="cloud-sync">Cloud Storage</button>
          <button class="tab-btn" data-subtab="audit-logs">Audit Logs</button>
          <button class="tab-btn" data-subtab="ai-summary">AI Insights</button>
          <button class="tab-btn" data-subtab="role-control">Access Control</button>
          <button class="tab-btn" data-subtab="webhooks">Telegram/Slack</button>
          <button class="tab-btn" data-subtab="db-archiver">DB Archiver</button>
        </nav>

        <main id="reports-main-view"></main>
      </div>
    `;

    this.renderActiveSubTab();
  }

  renderActiveSubTab() {
    const view = this.container.querySelector('#reports-main-view');
    if (!view) return;

    switch (this.activeSubTab) {
      case 'report-generator': ReportGeneratorModule.render(view, reportsCoreInstance); break;
      case 'email-reports': AutomatedEmailReportsModule.render(view, reportsCoreInstance); break;
      case 'csv-downloads': CsvExcelDownloadsModule.render(view, reportsCoreInstance); break;
      case 'pdf-builder': PdfDashboardBuilderModule.render(view); break;
      case 'cloud-sync': CloudBackupSyncModule.render(view); break;
      case 'audit-logs': ExportAuditLogsModule.render(view, reportsCoreInstance); break;
      case 'ai-summary': AiReportSummaryModule.render(view); break;
      case 'role-control': RoleExportControlModule.render(view); break;
      case 'webhooks': TelegramSlackWebhookModule.render(view); break;
      case 'db-archiver': DataRetentionArchiverModule.render(view); break;
      default: ReportGeneratorModule.render(view, reportsCoreInstance); break;
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

export const reportsAssemblyInstance = new ReportsAssembly();
