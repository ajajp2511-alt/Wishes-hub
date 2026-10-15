/**
 * Live Stock Alert, Auto-Disable Out-of-Stock, Expiry Watcher
 * Path: admin/features/coupons/admin-inventory-guard.js
 * Description: Monitors inventory levels, auto-disables expired/out-of-stock items,
 *              and triggers alerts when stock drops below threshold.
 */

import { couponsCore } from './coupons-core.js';

export class AdminInventoryGuardEngine {
  constructor() {
    this.core = couponsCore;
    this.lowStockThreshold = 5;
  }

  /**
   * Run Inventory Audit & Expiry Watcher
   */
  auditInventory() {
    const now = new Date();
    let expiredCount = 0;
    let outOfStockCount = 0;
    let warningCount = 0;

    this.core.state.inventoryQueue.forEach(item => {
      // Rule 1: Expiry Audit
      if (item.expiryDate && new Date(item.expiryDate) <= now && item.status !== 'EXPIRED') {
        item.status = 'EXPIRED';
        expiredCount++;
        this.core.log('INVENTORY_GUARD', `Coupon [${item.title}] marked as EXPIRED.`, 'WARN');
      }

      // Rule 2: Out of Stock Audit
      if (item.stockCount <= 0 && item.status === 'ACTIVE') {
        item.status = 'OUT_OF_STOCK';
        outOfStockCount++;
        this.core.log('INVENTORY_GUARD', `Coupon [${item.title}] marked as OUT_OF_STOCK.`, 'WARN');
      }

      // Rule 3: Low Stock Warning
      if (item.stockCount > 0 && item.stockCount <= this.lowStockThreshold && item.status === 'ACTIVE') {
        warningCount++;
      }
    });

    const report = {
      auditedAt: now.toISOString(),
      totalInventoryItems: this.core.state.inventoryQueue.length,
      expiredCount,
      outOfStockCount,
      lowStockWarnings: warningCount
    };

    this.core.log('INVENTORY_GUARD', `Audit complete: ${expiredCount} expired, ${outOfStockCount} out of stock, ${warningCount} low stock alerts.`, 'INFO');
    return report;
  }

  /**
   * Deduct Stock Post Successful Purchase
   */
  deductStock(couponId, quantity = 1) {
    const item = this.core.state.inventoryQueue.find(c => c.id === couponId);
    if (!item) return { success: false, error: 'Coupon not found in inventory.' };

    if (item.stockCount < quantity) {
      return { success: false, error: 'Insufficient stock available.' };
    }

    item.stockCount -= quantity;
    if (item.stockCount <= 0) {
      item.status = 'OUT_OF_STOCK';
    }

    this.core.log('INVENTORY_GUARD', `Deducted ${quantity} stock for [${item.title}]. Remaining: ${item.stockCount}`, 'INFO');
    return { success: true, remainingStock: item.stockCount };
  }
}

export const adminInventoryGuard = new AdminInventoryGuardEngine();
