/**
 * Assets & Inventory Hub - Core State Manager & CRUD Engine
 * Path: admin/features/assets/assets-core.js
 */

import { ASSET_CATEGORIES, ASSET_STATUSES } from './assets-config.js';

export class AssetsCore {
  constructor() {
    this.assetsList = [];
    this.filteredAssets = [];
    this.selectedCategory = ASSET_CATEGORIES.ANIMATIONS;
    this.searchQuery = '';
    this.selectedTag = 'All';
    this.currentPage = 1;
    this.itemsPerPage = 12;
  }

  /**
   * Fetch all assets from Backend / Google Sheets database
   */
  async fetchAssets(category = this.selectedCategory) {
    this.selectedCategory = category;
    try {
      const response = await fetch(`/api/assets?category=${category}`);
      const result = await response.json();

      if (!response.ok) throw new Error(result.message || 'Failed to fetch assets');

      this.assetsList = result.data || [];
      this.applyFilters();
      return { success: true, count: this.assetsList.length };
    } catch (error) {
      console.error('[AssetsCore] Fetch Error:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Filter assets by Search Query, Tag, and Category
   */
  applyFilters() {
    this.filteredAssets = this.assetsList.filter(asset => {
      const matchesCategory = !this.selectedCategory || asset.category === this.selectedCategory;
      const matchesSearch = !this.searchQuery || 
        (asset.title && asset.title.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
        (asset.id && asset.id.toLowerCase().includes(this.searchQuery.toLowerCase()));
      const matchesTag = this.selectedTag === 'All' || (asset.tags && asset.tags.includes(this.selectedTag));

      return matchesCategory && matchesSearch && matchesTag;
    });

    this.currentPage = 1;
  }

  /**
   * Get Paginated Chunk of Assets
   */
  getPaginatedAssets() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return {
      items: this.filteredAssets.slice(startIndex, endIndex),
      totalPages: Math.ceil(this.filteredAssets.length / this.itemsPerPage) || 1,
      currentPage: this.currentPage,
      totalItems: this.filteredAssets.length
    };
  }

  /**
   * Add or Save New Asset Item
   */
  async saveAsset(assetPayload) {
    try {
      const response = await fetch('/api/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_asset',
          asset: {
            ...assetPayload,
            id: assetPayload.id || `AST_${Date.now()}`,
            category: this.selectedCategory,
            status: assetPayload.status || ASSET_STATUSES.ACTIVE,
            createdAt: new Date().toISOString()
          }
        })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to save asset');

      return { success: true, data: result.data };
    } catch (error) {
      console.error('[AssetsCore] Save Error:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Delete or Soft-Archive Asset Item
   */
  async deleteAsset(assetId) {
    try {
      const response = await fetch('/api/assets', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assetId })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to delete asset');

      this.assetsList = this.assetsList.filter(a => a.id !== assetId);
      this.applyFilters();
      return { success: true };
    } catch (error) {
      console.error('[AssetsCore] Delete Error:', error);
      return { success: false, message: error.message };
    }
  }
}

export const assetsCoreInstance = new AssetsCore();
