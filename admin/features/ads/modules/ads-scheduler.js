/**
 * Wishes Hub - Duration & Auto-Expiry Scheduler Engine
 * File: admin/features/ads/modules/ads-scheduler.js
 * Description: Calculates active campaign validity, checks date ranges,
 *              and auto-expires campaigns when duration completes.
 */

import { ADS_CONFIG } from '../ads-config.js';

export class AdsScheduler {
  constructor(coreInstance) {
    this.core = coreInstance;
  }

  /**
   * Calculate end expiry date based on start date and total active days
   * @param {string|Date} startDate 
   * @param {number} days 
   * @returns {Date} Expiry Date Object
   */
  calculateExpiryDate(startDate, days) {
    const start = new Date(startDate);
    const expiry = new Date(start);
    expiry.setDate(expiry.getDate() + Math.max(1, parseInt(days, 10)));
    return expiry;
  }

  /**
   * Run background check to mark expired campaigns as 'EXPIRED'
   * @returns {Array} List of auto-expired ad IDs
   */
  checkAndRunAutoExpiry() {
    const now = new Date();
    const expiredIds = [];

    this.core.state.activeAds.forEach(ad => {
      if (ad.status === ADS_CONFIG.STATUS.ACTIVE) {
        const expiryDate = this.calculateExpiryDate(ad.startDate, ad.durationDays);
        if (now > expiryDate) {
          ad.status = ADS_CONFIG.STATUS.EXPIRED;
          ad.expiredAt = now.toISOString();
          expiredIds.push(ad.adId);
        }
      }
    });

    if (expiredIds.length > 0) {
      this.core.setStorageItem(ADS_CONFIG.STORAGE_KEYS.ACTIVE_ADS, this.core.state.activeAds);
      console.log(`[AdsScheduler] Auto-expired ${expiredIds.length} ad campaign(s):`, expiredIds);
    }

    return expiredIds;
  }

  /**
   * Get remaining days count for an active ad campaign
   * @param {Object} adRecord 
   * @returns {number} Days remaining (0 if expired)
   */
  getRemainingDays(adRecord) {
    const now = new Date();
    const expiryDate = this.calculateExpiryDate(adRecord.startDate, adRecord.durationDays);
    const diffTime = expiryDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }
}
