/**
 * Interactive Card List View, Filter, Search, & Category Manager
 * Path: admin/features/coupons/coupons-ui-renderer.js
 * Description: Manages catalog filtering, category tabs, real-time search queries,
 *              and pagination for marketplace users.
 */

import { couponsCore } from './coupons-core.js';

export class CouponsUIRendererEngine {
  constructor() {
    this.core = couponsCore;
  }

  /**
   * Filter and Search Inventory Catalog
   */
  getFilteredCatalog({ category = 'All', searchQuery = '', maxPriceINR = 100000 }) {
    const catalog = this.core.state.inventoryQueue.filter(item => item.status === 'ACTIVE');

    return catalog.filter(item => {
      // Category Match
      const matchesCategory = category === 'All' || item.category.toLowerCase() === category.toLowerCase();
      
      // Search Query Match (Title or Brand)
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || 
        item.title.toLowerCase().includes(query) || 
        item.brandName.toLowerCase().includes(query) || 
        item.voucherCode.toLowerCase().includes(query);

      // Price Filter Match
      const matchesPrice = item.sellingPriceINR <= Number(maxPriceINR);

      return matchesCategory && matchesSearch && matchesPrice;
    });
  }

  /**
   * Generate Category List with Counts
   */
  getCategoriesWithCounts() {
    const catalog = this.core.state.inventoryQueue.filter(item => item.status === 'ACTIVE');
    const counts = { All: catalog.length };

    this.core.state.activeCategories.forEach(cat => {
      if (cat !== 'All') {
        counts[cat] = catalog.filter(item => item.category.toLowerCase() === cat.toLowerCase()).length;
      }
    });

    return counts;
  }
}

export const couponsUIRenderer = new CouponsUIRendererEngine();
