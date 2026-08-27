/**
 * Manage Wish Feature - Core Engine & Data Handlers
 * Path: admin/features/manage-wish/manage-wish-core.js
 */

import { MANAGE_WISH_CONFIG } from './manage-wish-config.js';

export class ManageWishCore {
  constructor() {
    this.wishes = [];
    this.filteredWishes = [];
    this.selectedWishIds = new Set();
    this.currentPage = 1;
    this.pageSize = MANAGE_WISH_CONFIG.defaultPageSize;
    this.activeCategoryFilter = 'All';
    this.activeStatusFilter = 'All';
    this.searchQuery = '';
  }

  async fetchAllWishes() {
    try {
      const response = await fetch('/api/sheets?action=list_all', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to fetch wishes');

      this.wishes = result.data || [];
      this.applyFilters();
      return { success: true, total: this.wishes.length };
    } catch (error) {
      console.error('[ManageWishCore] Fetch Error:', error);
      return { success: false, message: error.message };
    }
  }

  applyFilters() {
    this.filteredWishes = this.wishes.filter((wish) => {
      const matchesCategory =
        this.activeCategoryFilter === 'All' || wish.Category === this.activeCategoryFilter;
      const matchesStatus =
        this.activeStatusFilter === 'All' || wish.Status === this.activeStatusFilter;
      const matchesSearch =
        !this.searchQuery ||
        wish.Title?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        wish.Wish_ID?.toLowerCase().includes(this.searchQuery.toLowerCase());

      return matchesCategory && matchesStatus && matchesSearch;
    });

    this.currentPage = 1;
  }

  getPaginatedWishes() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return {
      items: this.filteredWishes.slice(start, end),
      totalPages: Math.ceil(this.filteredWishes.length / this.pageSize) || 1,
      currentPage: this.currentPage,
      totalCount: this.filteredWishes.length
    };
  }

  toggleSelectWish(wishId) {
    if (this.selectedWishIds.has(wishId)) {
      this.selectedWishIds.delete(wishId);
    } else {
      this.selectedWishIds.add(wishId);
    }
  }

  selectAllOnPage() {
    const pageItems = this.getPaginatedWishes().items;
    pageItems.forEach((item) => this.selectedWishIds.add(item.Wish_ID));
  }

  clearSelection() {
    this.selectedWishIds.clear();
  }

  async bulkUpdateStatus(newStatus) {
    if (this.selectedWishIds.size === 0) {
      return { success: false, message: 'No items selected.' };
    }

    try {
      const response = await fetch('/api/sheets', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'bulk_status_update',
          wishIds: Array.from(this.selectedWishIds),
          status: newStatus
        })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Bulk update failed');

      await this.fetchAllWishes();
      this.clearSelection();

      return { success: true, count: result.updatedCount };
    } catch (error) {
      console.error('[ManageWishCore] Bulk Update Error:', error);
      return { success: false, message: error.message };
    }
  }
}

export const manageWishCoreInstance = new ManageWishCore();
