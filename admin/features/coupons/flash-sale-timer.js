/**
 * Countdown Timer Manager & Flash Deal Dynamic Pricing Engine
 * Path: admin/features/coupons/flash-sale-timer.js
 * Description: Manages flash sales, real-time countdown timers, live stock counters,
 *              and dynamic surge discount calculations.
 */

import { couponsCore } from './coupons-core.js';

export class FlashSaleTimerEngine {
  constructor() {
    this.core = couponsCore;
    this.activeFlashSales = [];
  }

  /**
   * Create New Flash Sale Campaign
   */
  createFlashSale({ couponId, title, extraDiscountPercent = 15, durationMinutes = 60, flashStockLimit = 20 }) {
    const flashSale = {
      flashId: 'FLASH_' + Date.now(),
      couponId,
      title,
      extraDiscountPercent,
      flashStockLimit,
      remainingFlashStock: flashStockLimit,
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + durationMinutes * 60 * 1000).toISOString(),
      status: 'ACTIVE'
    };

    this.activeFlashSales.unshift(flashSale);
    this.core.log('FLASH_SALE', `Created Flash Sale [${title}] valid for ${durationMinutes} mins`, 'SUCCESS');
    
    return flashSale;
  }

  /**
   * Get Remaining Flash Time Status
   */
  getFlashStatus(flashId) {
    const sale = this.activeFlashSales.find(f => f.flashId === flashId);
    if (!sale) return { active: false, reason: 'Flash sale not found' };

    const now = new Date().getTime();
    const end = new Date(sale.endTime).getTime();
    const diffMs = end - now;

    if (diffMs <= 0 || sale.remainingFlashStock <= 0) {
      sale.status = 'EXPIRED';
      return { active: false, reason: 'Flash deal ended or stock sold out' };
    }

    const seconds = Math.floor((diffMs / 1000) % 60);
    const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
    const hours = Math.floor(diffMs / (1000 * 60 * 60));

    return {
      active: true,
      flashId: sale.flashId,
      remainingStock: sale.remainingFlashStock,
      formattedCountdown: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    };
  }
}

export const flashSaleTimer = new FlashSaleTimerEngine();
