/**
 * Manage Wish Feature - Main Assembly & UI Integrator
 * Path: admin/features/manage-wish/manage-wish-assembly.js
 */

import { TABLE_COLUMNS, FILTER_OPTIONS, WISH_STATUSES } from './manage-wish-config.js';
import { manageWishCoreInstance } from './manage-wish-core.js';
import { manageWishHealthInstance } from './manage-wish-health.js';
import { manageWishAnalyticsInstance } from './manage-wish-analytics.js';
import { manageWishImportExportInstance } from './manage-wish-import-export.js';
import { manageWishHistoryInstance } from './manage-wish-history.js';
import { manageWishSafetyInstance } from './manage-wish-safety.js';

export class ManageWishAssembly {
  constructor() {
    this.rootElement = null;
  }

  /**
   * Initialize and Build Complete Management Interface
   */
  async init(containerId = 'manage-wish-module-root') {
    this.rootElement = document.getElementById(containerId);
    if (!this.rootElement) {
      console.error(`[ManageWishAssembly] Root #${containerId} not found.`);
      return;
    }

    // Render Main Layout Structure
    this.rootElement.innerHTML = `
      <div class="manage-wish-container">
        <!-- Top Stats & Health Header -->
        <div class="wish-health-bar" id="health-status-bar">
          <span class="status-indicator">Checking Sheet Health...</span>
        </div>

        <!-- Filter & Search Toolbar -->
        <div class="toolbar-section">
          <input type="text" id="search-wish-input" placeholder="Search by Wish ID or Title..." />
          
          <select id="filter-category-select">
            ${FILTER_OPTIONS.categories.map(c => `<option value="${c}">Category: ${c}</option>`).join('')}
          </select>

          <select id="filter-status-select">
            ${FILTER_OPTIONS.statuses.map(s => `<option value="${s}">Status: ${s}</option>`).join('')}
          </select>

          <div class="action-buttons">
            <button id="btn-bulk-delete" class="btn-danger">Bulk Delete</button>
            <button id="btn-export-csv" class="btn-secondary">Export CSV</button>
            <button id="btn-undo-action" class="btn-outline">↩ Undo</button>
          </div>
        </div>

        <!-- Main Datatable -->
        <div class="table-wrapper">
          <table class="manage-wish-table">
            <thead>
              <tr>
                <th><input type="checkbox" id="select-all-checkbox" /></th>
                ${TABLE_COLUMNS.filter(c => c.key !== 'select').map(c => `<th>${c.label}</th>`).join('')}
              </tr>
            </thead>
            <tbody id="wish-table-body">
              <tr><td colspan="7">Loading wish data...</td></tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination Bar -->
        <div class="pagination-bar" id="pagination-container"></div>
      </div>
    `;

    this.bindEvents();
    await this.refreshData();
    this.runHealthCheck();
  }

  /**
   * Refresh Data & Re-render Datatable
   */
  async refreshData() {
    const res = await manageWishCoreInstance.fetchAllWishes();
    if (res.success) {
      this.renderTable();
    } else {
      document.getElementById('wish-table-body').innerHTML = `
        <tr><td colspan="7" class="error-msg">Error loading data: ${res.message}</td></tr>
      `;
    }
  }

  /**
   * Render Table Rows Dynamically
   */
  renderTable() {
    const tbody = document.getElementById('wish-table-body');
    const paginated = manageWishCoreInstance.getPaginatedWishes();

    if (paginated.items.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="empty-msg">No wishes found.</td></tr>`;
      return;
    }

    tbody.innerHTML = paginated.items.map(item => {
      // Run Spam Scan on row render
      const safetyCheck = manageWishSafetyInstance.inspectForSpam(item.Content, item.Title);
      const isSelected = manageWishCoreInstance.selectedWishIds.has(item.Wish_ID);

      return `
        <tr class="${safetyCheck.isSpam ? 'row-spam-warning' : ''}">
          <td>
            <input type="checkbox" class="row-checkbox" data-id="${item.Wish_ID}" ${isSelected ? 'checked' : ''} />
          </td>
          <td><code>${item.Wish_ID}</code></td>
          <td><strong>${item.Title || 'Untitled'}</strong></td>
          <td><span class="badge category-${item.Category}">${item.Category}</span></td>
          <td><span class="badge status-${item.Status}">${item.Status}</span></td>
          <td>${new Date(item.Created_At).toLocaleDateString()}</td>
          <td>
            <button class="btn-sm btn-inspect" data-id="${item.Wish_ID}">Inspect</button>
            <button class="btn-sm btn-archive" data-id="${item.Wish_ID}">Archive</button>
          </td>
        </tr>
      `;
    }).join('');

    this.renderPagination(paginated);
    this.attachRowEvents();
  }

  /**
   * Render Pagination UI Controls
   */
  renderPagination({ currentPage, totalPages, totalCount }) {
    const container = document.getElementById('pagination-container');
    if (!container) return;

    container.innerHTML = `
      <span>Showing Page ${currentPage} of ${totalPages} (${totalCount} Total Items)</span>
      <div class="page-btns">
        <button id="btn-prev-page" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>
        <button id="btn-next-page" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>
      </div>
    `;

    document.getElementById('btn-prev-page')?.addEventListener('click', () => {
      manageWishCoreInstance.currentPage--;
      this.renderTable();
    });

    document.getElementById('btn-next-page')?.addEventListener('click', () => {
      manageWishCoreInstance.currentPage++;
      this.renderTable();
    });
  }

  /**
   * Event Binding Setup
   */
  bindEvents() {
    // Search Box Listener
    document.getElementById('search-wish-input')?.addEventListener('input', (e) => {
      manageWishCoreInstance.searchQuery = e.target.value;
      manageWishCoreInstance.applyFilters();
      this.renderTable();
    });

    // Category Filter Listener
    document.getElementById('filter-category-select')?.addEventListener('change', (e) => {
      manageWishCoreInstance.activeCategoryFilter = e.target.value;
      manageWishCoreInstance.applyFilters();
      this.renderTable();
    });

    // Status Filter Listener
    document.getElementById('filter-status-select')?.addEventListener('change', (e) => {
      manageWishCoreInstance.activeStatusFilter = e.target.value;
      manageWishCoreInstance.applyFilters();
      this.renderTable();
    });

    // Select All Checkbox
    document.getElementById('select-all-checkbox')?.addEventListener('change', (e) => {
      if (e.target.checked) {
        manageWishCoreInstance.selectAllOnPage();
      } else {
        manageWishCoreInstance.clearSelection();
      }
      this.renderTable();
    });

    // Export CSV Trigger
    document.getElementById('btn-export-csv')?.addEventListener('click', () => {
      manageWishImportExportInstance.exportData(manageWishCoreInstance.filteredWishes, 'csv');
    });

    // Undo Action Trigger
    document.getElementById('btn-undo-action')?.addEventListener('click', async () => {
      const undoRes = await manageWishHistoryInstance.undoLastAction();
      alert(undoRes.success ? `Action Undone for Wish: ${undoRes.wishId}` : undoRes.message);
      if (undoRes.success) this.refreshData();
    });

    // Bulk Delete Action Trigger
    document.getElementById('btn-bulk-delete')?.addEventListener('click', async () => {
      if (confirm('Are you sure you want to move selected wishes to Spam/Archived?')) {
        const res = await manageWishCoreInstance.bulkUpdateStatus(WISH_STATUSES.ARCHIVED);
        alert(res.success ? `Updated ${res.count} items.` : res.message);
        this.renderTable();
      }
    });
  }

  /**
   * Dynamic Row Events Setup
   */
  attachRowEvents() {
    document.querySelectorAll('.row-checkbox').forEach(box => {
      box.addEventListener('change', (e) => {
        manageWishCoreInstance.toggleSelectWish(e.target.dataset.id);
      });
    });

    document.querySelectorAll('.btn-archive').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const wishId = e.target.dataset.id;
        manageWishHistoryInstance.pushAction('STATUS_UPDATE', { Wish_ID: wishId }, WISH_STATUSES.ACTIVE);
        alert(`Archived Wish ID: ${wishId}`);
        await this.refreshData();
      });
    });
  }

  /**
   * Health Bar Status Update
   */
  async runHealthCheck() {
    const health = await manageWishHealthInstance.checkSheetHealth();
    const bar = document.getElementById('health-status-bar');
    if (bar) {
      bar.className = `wish-health-bar status-${health.status.toLowerCase()}`;
      bar.innerHTML = `<strong>Sheet API Health:</strong> ${health.message} (${health.quotaUsedPercent}% Quota Used)`;
    }
  }
}

export const manageWishAssemblyInstance = new ManageWishAssembly();
