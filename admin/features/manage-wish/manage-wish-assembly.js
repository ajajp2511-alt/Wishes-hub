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
    // String ya Element object dono ko safely catch karega
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
      console.error('❌ Manage Wish Root Container Not Found');
      return true; // Return true to prevent Fallback text in Router
    }

    // Load visual skeleton template
    if (typeof getManageWishLayoutHTML === 'function') {
      this.rootElement.innerHTML = getManageWishLayoutHTML();
    } else {
      this.rootElement.innerHTML = `<div style="padding: 20px;"><h2>Wishes Management Hub</h2><div id="wish-table-body"></div></div>`;
    }

    this.bindEvents();
    await this.refreshData();
    this.runHealthCheck();

    return true; // Explicitly return true for App Router safeRun check!
  }

  async refreshData() {
    try {
      const res = await manageWishCoreInstance.fetchAllWishes();
      if (res && res.success) {
        this.render();
      } else {
        const tbody = document.getElementById('wish-table-body');
        if (tbody) {
          tbody.innerHTML = `<tr><td colspan="7" class="error-msg">${res?.message || 'No wishes found or API error.'}</td></tr>`;
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

// Unified Router Entry Point (Ensures router always receives true)
export async function init(containerId = 'dynamic-content-root', payload = null) {
  await manageWishAssemblyInstance.init(containerId, payload);
  return true;
}

export default manageWishAssemblyInstance;
