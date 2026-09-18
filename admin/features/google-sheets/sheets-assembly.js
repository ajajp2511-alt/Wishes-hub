/**
 * Main Assembly Controller - Google Sheets Views & Integration Hub
 * Path: admin/features/google-sheets/sheets-assembly.js
 */

import { sheetsCoreInstance, getMasterSheetValues, getSubSheetValues, appendSheetIdToMaster, deleteSheetIdFromMaster } from './sheets-core.js';
import { renderDirectoryCards } from './components/sheet-directory.js';
import { renderDataTable } from './components/sheet-table.js';
import { setupToolbarControls } from './components/sheet-toolbar.js';
import { renderAddSheetModal } from './components/sheet-modal.js';

// Other Sub-Tab Modules
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
    this.activeMasterList = [];
    this.activeSheetHeaders = [];
    this.activeSheetRows = [];
  }

  // Universal Smart Router compatibility wrapper
  initGoogleSheets(rootId) {
    return this.init(rootId);
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

        <nav style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:20px; border-bottom: 1px solid #30363d; padding-bottom: 10px;">
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

  async renderActiveSubTab() {
    const view = this.container.querySelector('#sheets-main-view');
    if (!view) return;

    switch (this.activeSubTab) {
      case 'master-sheet':
        await this.renderMasterSheetDashboard(view);
        break;
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
      default: await this.renderMasterSheetDashboard(view); break;
    }
  }

  // --- Master Sheet Dashboard Core Methods ---
  async loadMasterDirectoryData() {
    const rawRows = await getMasterSheetValues();
    const directoryPromises = rawRows.map(async (row, index) => {
      const sheetName = row[0] || 'Untitled Sheet';
      const sheetId = row[1] || '';
      let totalRows = 0;
      if (sheetId) {
        const subData = await getSubSheetValues(sheetId);
        totalRows = subData.length > 0 ? subData.length - 1 : 0;
      }
      return { id: index + 1, sheetName, sheetId, totalRows };
    });
    this.activeMasterList = await Promise.all(directoryPromises);
    return this.activeMasterList;
  }

  async loadSingleSheetContent(sheetId) {
    if (!sheetId) return { headers: [], rows: [] };
    const rawData = await getSubSheetValues(sheetId);
    if (rawData.length === 0) return { headers: [], rows: [] };
    this.activeSheetHeaders = rawData[0] || [];
    this.activeSheetRows = rawData.slice(1) || [];
    return { headers: this.activeSheetHeaders, rows: this.activeSheetRows };
  }

  async addNewSheetId(sheetName, sheetId, accessToken) {
    if (!sheetName || !sheetId) throw new Error('Sheet Name aur Sheet ID dono zaruri hain.');
    return await appendSheetIdToMaster(sheetName, sheetId, accessToken);
  }

  async removeSheetId(rowIndex, accessToken) {
    if (!rowIndex) throw new Error('Row Index zaruri hai.');
    return await deleteSheetIdFromMaster(rowIndex, accessToken);
  }

  async renderMasterSheetDashboard(viewContainer) {
    viewContainer.innerHTML = `
      <div class="sheets-wrapper">
        <div class="top-bar" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h3 style="margin:0;">Master Sheet Dashboard</h3>
          <div class="action-tools" style="display: flex; gap: 10px; align-items: center;">
            <button id="add-sheet-btn" style="background-color: #10b981; color: white; border: none; padding: 8px 14px; border-radius: 4px; cursor: pointer;">+ Add Sheet</button>
            <select id="sheet-dropdown" class="dropdown-select" style="display: none; padding: 6px; border-radius: 4px;"></select>
            <input type="text" id="search-input" class="search-input" placeholder="Search data..." style="display: none; padding: 6px; border-radius: 4px;" />
            <button id="refresh-btn" style="padding: 6px 12px; border-radius: 4px; cursor: pointer;">Sync Data 🔄</button>
          </div>
        </div>

        <div id="directory-container">
          <h4 style="margin-bottom: 10px;">All Google Sheets</h4>
          <div id="directory-grid" class="directory-grid"></div>
        </div>

        <div id="sheet-view-container" style="display: none; margin-top: 20px;">
          <h4 id="active-sheet-title" style="margin-bottom: 10px;">Sheet View</h4>
          <div id="table-wrapper"></div>
        </div>
      </div>

      <div id="modal-container"></div>
    `;

    const directoryGrid = viewContainer.querySelector('#directory-grid');
    const sheetDropdown = viewContainer.querySelector('#sheet-dropdown');
    const searchInput = viewContainer.querySelector('#search-input');
    const refreshBtn = viewContainer.querySelector('#refresh-btn');
    const addSheetBtn = viewContainer.querySelector('#add-sheet-btn');
    const modalContainer = viewContainer.querySelector('#modal-container');
    const sheetViewContainer = viewContainer.querySelector('#sheet-view-container');
    const activeSheetTitle = viewContainer.querySelector('#active-sheet-title');
    const tableWrapper = viewContainer.querySelector('#table-wrapper');

    const userAccessToken = window.ENV_ACCESS_TOKEN || '';

    const handleSelect = async (sheetId, sheetName) => {
      if (!sheetId) return;
      sheetDropdown.value = sheetId;
      searchInput.style.display = 'inline-block';
      searchInput.value = '';
      sheetViewContainer.style.display = 'block';
      activeSheetTitle.innerText = `Loading: ${sheetName}...`;
      tableWrapper.innerHTML = '<p>Data fetch ho raha hai...</p>';

      const { headers, rows } = await this.loadSingleSheetContent(sheetId);
      activeSheetTitle.innerText = `Data View: ${sheetName}`;
      renderDataTable(tableWrapper, headers, rows);
    };

    const handleDelete = async (rowIndex) => {
      try {
        await this.removeSheetId(rowIndex, userAccessToken);
        alert('Sheet remove ho gayi!');
        await refreshUI();
      } catch (error) {
        alert('Error: ' + error.message);
      }
    };

    const refreshUI = async () => {
      directoryGrid.innerHTML = '<p>Master Sheet Sync ho rahi hai...</p>';
      await this.loadMasterDirectoryData();
      renderDirectoryCards(directoryGrid, this.activeMasterList, handleSelect, handleDelete);
      setupToolbarControls({
        dropdown: sheetDropdown,
        searchInput: searchInput,
        masterDataList: this.activeMasterList,
        onSheetSelect: handleSelect,
        onSearch: (query) => {
          const filteredRows = this.activeSheetRows.filter(row => 
            row.some(cell => String(cell).toLowerCase().includes(query))
          );
          renderDataTable(tableWrapper, this.activeSheetHeaders, filteredRows);
        }
      });
    };

    addSheetBtn.addEventListener('click', () => {
      renderAddSheetModal(modalContainer, async (name, id) => {
        try {
          await this.addNewSheetId(name, id, userAccessToken);
          alert('Sheet successfully add ho gayi!');
          modalContainer.innerHTML = '';
          await refreshUI();
        } catch (error) {
          alert('Error: ' + error.message);
        }
      }, () => {
        modalContainer.innerHTML = '';
      });
    });

    refreshBtn.addEventListener('click', refreshUI);
    await refreshUI();
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
