/**
 * Price Drop Watchers, Stock Alerts & Push Notification Payload Builder
 * Path: admin/features/coupons/wishlist-push-alerts.js
 * Description: Tracks user coupon wishlists and builds automated push/WhatsApp
 *              notifications when prices drop or out-of-stock items replenish.
 */

import { couponsCore } from './coupons-core.js';

export class WishlistPushAlertsEngine {
  constructor() {
    this.core = couponsCore;
    this.wishlists = {};
  }

  /**
   * Toggle Item in User Wishlist
   */
  toggleWishlist(userId, couponId) {
    if (!this.wishlists[userId]) {
      this.wishlists[userId] = new Set();
    }

    const userSet = this.wishlists[userId];
    let added = false;

    if (userSet.has(couponId)) {
      userSet.delete(couponId);
    } else {
      userSet.add(couponId);
      added = true;
    }

    this.core.log('WISHLIST', `User [${userId}] ${added ? 'added' : 'removed'} Coupon [${couponId}] ${added ? 'to' : 'from'} wishlist.`, 'INFO');
    return { success: true, isWishlisted: added, totalWishlisted: userSet.size };
  }

  /**
   * Build Price Drop Notification Payload
   */
  buildPriceDropAlertPayload(couponItem, oldPriceINR, newPriceINR) {
    return {
      title: `🔥 Price Drop Alert: ${couponItem.brandName}!`,
      body: `Good news! ${couponItem.title} is now available for ₹${newPriceINR} (Down from ₹${oldPriceINR}). Grab yours before stock runs out!`,
      couponId: couponItem.id,
      deepLink: `https://wishes-hub.com/coupons/${couponItem.id}`
    };
  }
}

export const wishlistPushAlerts = new WishlistPushAlertsEngine();
