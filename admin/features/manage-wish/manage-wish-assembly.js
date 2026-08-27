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

  async init(containerId = 'outlet-root') {
    this.rootElement = document.getElementById(containerId);
    if (!this.rootElement) return;

    // Load visual skeleton
    this.rootElement.innerHTML = getManageWishLayoutHTML();

    this.bindEvents();
    await this.refreshData();
    this.runHealthCheck();
  }

  async refreshData() {
    const res = await manageWishCoreInstance.fetchAllWishes();
    if (res.success) {
      this.render();
    } else {
      const tbody = document.getElementById('wish-table-body');
      if (tbody) tbody.innerHTML = `<tr><td colspan="7" class="error-msg">${res.message}</td></tr>`;
    }
  }

  render() {
    const tbody = document.getElementById('wish-table-body');
    const paginationContainer = document.getElementById('pagination-container');
    const paginated = manageWishCoreInstance.getPaginatedWishes();

    manageWishTableRendererInstance.renderRows(tbody, paginated, manageWishCoreInstance.selectedWishIds);
    manageWishTableRendererInstance.renderPagination(
      paginationContainer,
      paginated,
      () => { manageWishCoreInstance.currentPage--; this.render(); },
      () => { manageWishCoreInstance.currentPage++; this.render(); }
    );

    this.attachRowEvents();
  }

  bindEvents() {
    document.getElementById('search-wish-input')?.addEventListener('input', (e) => {
      manageWishCoreInstance.searchQuery = e.target.value;
      manageWishCoreInstance.applyFilters();
      this.render();
    });

    document.getElementById('filter-category-select')?.addEventListener('change', (e) => {
      manageWishCoreInstance.activeCategoryFilter = e.target.value;
      manageWishCoreInstance.applyFilters();
      this.render();
    });

    document.getElementById('filter-status-select')?.addEventListener('change', (e) => {
      manageWishCoreInstance.activeStatusFilter = e.target.value;
      manageWishCoreInstance.applyFilters();
      this.render();
    });

    document.getElementById('select-all-checkbox')?.addEventListener('change', (e) => {
      e.target.checked ? manageWishCoreInstance.selectAllOnPage() : manageWishCoreInstance.clearSelection();
      this.render();
    });

    document.getElementById('btn-export-csv')?.addEventListener('click', () => {
      manageWishImportExportInstance.exportData(manageWishCoreInstance.filteredWishes, 'csv');
    });

    document.getElementById('btn-undo-action')?.addEventListener('click', async () => {
      const undoRes = await manageWishHistoryInstance.undoLastAction();
      alert(undoRes.success ? `Action Undone for Wish: ${undoRes.wishId}` : undoRes.message);
      if (undoRes.success) this.refreshData();
    });

    document.getElementById('btn-bulk-delete')?.addEventListener('click', async () => {
      if (confirm('Move selected wishes to Archived/Spam?')) {
        const res = await manageWishCoreInstance.bulkUpdateStatus(WISH_STATUSES.ARCHIVED);
        alert(res.success ? `Updated ${res.count} items.` : res.message);
        this.render();
      }
    });
  }

  attachRowEvents() {
    document.querySelectorAll('.row-checkbox').forEach(box => {
      box.addEventListener('change', (e) => manageWishCoreInstance.toggleSelectWish(e.target.dataset.id));
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

export async function init(containerId = 'outlet-root') {
  await manageWishAssemblyInstance.init(containerId);
                                       }
