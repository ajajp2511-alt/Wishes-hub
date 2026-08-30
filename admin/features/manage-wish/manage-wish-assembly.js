/**
 * Manage Wish Feature - Lightweight Controller Assembly
 * Path: admin/features/manage-wish/manage-wish-assembly.js
 */

import { WISH_STATUSES } from './manage-wish-config.js';
import { manageWishCoreInstance } from './manage-wish-core.js';
import { getManageWishLayoutHTML } from './modules/manage-wish-template.js';
import { manageWishTableRendererInstance } from './modules/manage-wish-table-renderer.js';
import { manageWishHealthInstance } from './modules/manage-wish-health.js';
import { manageWishImportExportInstance } from './modules/manage-wish-import-export.js';
import { manageWishHistoryInstance } from './modules/manage-wish-history.js';

export class ManageWishAssembly {
  constructor() {
    this.rootElement = null;
  }

  async init(containerId = 'dynamic-content-root', payload = null) {
    // 1. Target resolution for element or string container
    if (typeof containerId === 'string') {
      this.rootElement = document.getElementById(containerId) || 
                         document.getElementById('dynamic-content-root') || 
                         document.getElementById('outlet-root');
    } else if (containerId && containerId.nodeType) {
      this.rootElement = containerId;
    } else {
      this.rootElement = document.getElementById('dynamic-content-root') || document.getElementById('outlet-root');
    }

    if (!this.rootElement) {
      console.error('❌ Dynamic content container missing in DOM.');
      return true; // Return true to clear fallback render
    }

    // 2. Clear pre-existing fallback notice
    this.rootElement.innerHTML = '';

    // 3. Inject visual structural layout
    if (typeof getManageWishLayoutHTML === 'function') {
      this.rootElement.innerHTML = getManageWishLayoutHTML();
    } else {
      this.rootElement.innerHTML = `
        <div style="padding: 20px;">
          <h2>Wishes Management Hub</h2>
          <div id="health-status-bar"></div>
          <table class="wish-table">
            <thead>
              <tr>
                <th><input type="checkbox" id="select-all-checkbox" /></th>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="wish-table-body"></tbody>
          </table>
          <div id="pagination-container"></div>
        </div>`;
    }

    // 4. Attach event listeners and load sheet data
    this.bindEvents();
    await this.refreshData();
    this.runHealthCheck();

    return true;
  }

  async refreshData() {
    try {
      const res = await manageWishCoreInstance.fetchAllWishes();
      if (res && res.success) {
        this.render();
      } else {
        const tbody = document.getElementById('wish-table-body');
        if (tbody) {
          tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 15px; color: #d9534f;">${res?.message || 'No wishes found or API error.'}</td></tr>`;
        }
      }
    } catch (err) {
      console.warn('Refresh Data Fallback Warning:', err);
      this.render();
    }
  }

  render() {
    const tbody = document.getElementById('wish-table-body');
    const paginationContainer = document.getElementById('pagination-container');
    const paginated = manageWishCoreInstance.getPaginatedWishes ? manageWishCoreInstance.getPaginatedWishes() : [];

    if (manageWishTableRendererInstance && tbody) {
      manageWishTableRendererInstance.renderRows(tbody, paginated, manageWishCoreInstance.selectedWishIds || []);
      
      if (paginationContainer) {
        manageWishTableRendererInstance.renderPagination(
          paginationContainer,
          paginated,
          () => { manageWishCoreInstance.currentPage--; this.render(); },
          () => { manageWishCoreInstance.currentPage++; this.render(); }
        );
      }
    }

    this.attachRowEvents();
  }

  bindEvents() {
    document.getElementById('search-wish-input')?.addEventListener('input', (e) => {
      manageWishCoreInstance.searchQuery = e.target.value;
      if (manageWishCoreInstance.applyFilters) manageWishCoreInstance.applyFilters();
      this.render();
    });

    document.getElementById('filter-category-select')?.addEventListener('change', (e) => {
      manageWishCoreInstance.activeCategoryFilter = e.target.value;
      if (manageWishCoreInstance.applyFilters) manageWishCoreInstance.applyFilters();
      this.render();
    });

    document.getElementById('filter-status-select')?.addEventListener('change', (e) => {
      manageWishCoreInstance.activeStatusFilter = e.target.value;
      if (manageWishCoreInstance.applyFilters) manageWishCoreInstance.applyFilters();
      this.render();
    });

    document.getElementById('select-all-checkbox')?.addEventListener('change', (e) => {
      e.target.checked ? manageWishCoreInstance.selectAllOnPage?.() : manageWishCoreInstance.clearSelection?.();
      this.render();
    });

    document.getElementById('btn-export-csv')?.addEventListener('click', () => {
      manageWishImportExportInstance.exportData?.(manageWishCoreInstance.filteredWishes, 'csv');
    });

    document.getElementById('btn-undo-action')?.addEventListener('click', async () => {
      const undoRes = await manageWishHistoryInstance.undoLastAction?.();
      if (undoRes) {
        alert(undoRes.success ? `Action Undone for Wish: ${undoRes.wishId}` : undoRes.message);
        if (undoRes.success) this.refreshData();
      }
    });

    document.getElementById('btn-bulk-delete')?.addEventListener('click', async () => {
      if (confirm('Move selected wishes to Archived/Spam?')) {
        const res = await manageWishCoreInstance.bulkUpdateStatus?.(WISH_STATUSES.ARCHIVED);
        if (res) alert(res.success ? `Updated ${res.count} items.` : res.message);
        this.render();
      }
    });
  }

  attachRowEvents() {
    document.querySelectorAll('.row-checkbox').forEach(box => {
      box.addEventListener('change', (e) => manageWishCoreInstance.toggleSelectWish?.(e.target.dataset.id));
    });

    document.querySelectorAll('.btn-archive').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const wishId = e.target.dataset.id;
        manageWishHistoryInstance.pushAction?.('STATUS_UPDATE', { Wish_ID: wishId }, WISH_STATUSES.ACTIVE);
        alert(`Archived Wish ID: ${wishId}`);
        await this.refreshData();
      });
    });
  }

  async runHealthCheck() {
    if (manageWishHealthInstance && typeof manageWishHealthInstance.checkSheetHealth === 'function') {
      const health = await manageWishHealthInstance.checkSheetHealth();
      const bar = document.getElementById('health-status-bar');
      if (bar && health) {
        bar.className = `wish-health-bar status-${health.status?.toLowerCase()}`;
        bar.innerHTML = `<strong>Sheet API Health:</strong> ${health.message} (${health.quotaUsedPercent}% Quota Used)`;
      }
    }
  }
}

export const manageWishAssemblyInstance = new ManageWishAssembly();

// Unified Router Entry Point
export async function init(containerId = 'dynamic-content-root', payload = null) {
  return await manageWishAssemblyInstance.init(containerId, payload);
}

export default manageWishAssemblyInstance;
