/**
 * Manage Wish Feature - Automated Spam Filter & Expiry Guard
 * Path: admin/features/manage-wish/manage-wish-safety.js
 */

import { WISH_STATUSES } from './manage-wish-config.js';

export class ManageWishSafety {
  constructor() {
    this.blacklistedKeywords = ['spam', 'buy now', 'free money', 'casino', 'betting', 'scam', 'lottery'];
  }

  /**
   * Scan wish text content for blacklisted terms or suspicious patterns
   */
  inspectForSpam(content = '', title = '') {
    const textToScan = `${title} ${content}`.toLowerCase();
    const detectedKeywords = [];

    this.blacklistedKeywords.forEach((word) => {
      if (textToScan.includes(word)) {
        detectedKeywords.push(word);
      }
    });

    const isSpam = detectedKeywords.length > 0;

    return {
      isSpam,
      detectedKeywords,
      recommendedStatus: isSpam ? WISH_STATUSES.SPAM : WISH_STATUSES.ACTIVE
    };
  }

  /**
   * Check if a scheduled wish has passed its expiry threshold
   */
  checkExpiryStatus(scheduledAt, expiryHours = 24) {
    if (!scheduledAt) return { isExpired: false };

    const scheduledDate = new Date(scheduledAt).getTime();
    const currentDate = new Date().getTime();
    const diffInHours = (currentDate - scheduledDate) / (1000 * 60 * 60);

    const isExpired = diffInHours >= expiryHours;

    return {
      isExpired,
      hoursElapsed: Math.round(diffInHours),
      recommendedStatus: isExpired ? WISH_STATUSES.EXPIRED : WISH_STATUSES.ACTIVE
    };
  }
}

export const manageWishSafetyInstance = new ManageWishSafety();
