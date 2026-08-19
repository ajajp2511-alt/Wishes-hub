/**
 * Main Assembly Controller - Google Sheets Views
 * Path: admin/features/google-sheets/sheets-assembly.js
 */

import { sheetsCoreInstance } from './sheets-core.js';
import { MasterSheetDashboardModule } from './modules/master-sheet-dashboard.js';
import { SyncStatusModule } from './modules/sync-status.js';
import { FormResponsesModule } from './modules/form-responses.js';
import { ApiMappingModule } from './modules/api-mapping.js';
import { AutoSyncTriggersModule } from './modules/auto-sync-triggers.js';
import { SheetDataSanitizerModule } from './modules/sheet-data-sanitizer.js';
import { BulkImportExportModule } from './modules/bulk-import-export.js';
import { SheetAccessControlModule } from './modules/sheet-access-control.js';
import { SheetAuditHistoryModule } from './modules/sheet-audit-history.js';
import { ConflictResolverModule } from './modules/conflict-resolver.js';
import { FormulaComputedFieldsModule } from './modules/formula-computed-fields.js';

export class SheetsAssembly {
  constructor() {
    this.container = null;
    this.activeSubTab = 'master-sheet';
  }

  init(rootId) {
    this.container = document.getElementById(rootId);
    if (!this.container) return;

    this.renderLayout();
    this.attachEventListeners();
  }

  renderLayout() {
    this.container.innerHTML = `
      <div class="google-sheets-container" style="padding:16px;">
        <header style="margin-bottom:20px;">
          <h2 style="margin:0;">Google Sheets Integration Hub</h2>
          <small style="color:#6e7681;">Live Sheet Dashboards, Sync Status, Form Responses & Schema Mappings</small>
        </header>

        <nav style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:20px;">
          <button class="tab-btn active" data-subtab="master-sheet">Master Dashboard</button>
          <button class="tab-btn" data-subtab="sync-status">Sync Status</button>
          <button class="tab-btn" data-subtab="forms">Form Responses</button>
          <button class="tab-btn" data-subtab="api-map">API Mapping</button>
          <button class="tab-btn" data-subtab="triggers">Auto-Sync Triggers</button>
          <button class="tab-btn" data-subtab="sanitizer">Data Sanitizer</button>
          <button class="tab-btn" data-subtab="import-export">Import & Export</button>
          <button class="tab-btn" data-subtab="access">Access Control</button>
          <button class="tab-btn" data-subtab="audit">Audit History</button>
          <button class="tab-btn" data-subtab="conflicts">Conflict Resolver</button>
          <button class="tab-btn" data-subtab="formulas">Formula Parser</button>
        </nav>

        <main id="sheets-main-view"></main>
      </div>
    `;

    this.renderActiveSubTab();
  }

  renderActiveSubTab() {
    const view = this.container.querySelector('#sheets-main-view');
    if (!view) return;

    switch (this.activeSubTab) {
      case 'master-sheet': MasterSheetDashboardModule.render(view, sheetsCoreInstance); break;
      case 'sync-status': SyncStatusModule.render(view, sheetsCoreInstance); break;
      case 'forms': FormResponsesModule.render(view); break;
      case 'api-map': ApiMappingModule.render(view, sheetsCoreInstance); break;
      case 'triggers': AutoSyncTriggersModule.render(view); break;
      case 'sanitizer': SheetDataSanitizerModule.render(view); break;
      case 'import-export': BulkImportExportModule.render(view); break;
      case 'access': SheetAccessControlModule.render(view); break;
      case 'audit': SheetAuditHistoryModule.render(view); break;
      case 'conflicts': ConflictResolverModule.render(view); break;
      case 'formulas': FormulaComputedFieldsModule.render(view); break;
      default: MasterSheetDashboardModule.render(view, sheetsCoreInstance); break;
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

export const sheetsAssemblyInstance = new SheetsAssembly();
