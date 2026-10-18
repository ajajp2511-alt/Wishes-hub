/**
 * Wishes Hub - Multi-Tier Split Payout & Commission Engine Module
 * File: modules/multi-tier-payout.js
 */

import { VENDOR_CONFIG } from '../local-vendors-config.js';

export class MultiTierPayoutModule {
  constructor() {
    this.moduleName = 'multi-tier-payout';
  }

  /**
   * Calculate split payouts for Order Value among Vendor, Delivery Rider, and Platform
   * @param {Object} payoutParams 
   * @returns {Object} Split ledger breakdown
   */
  calculateSplitPayout(payoutParams) {
    const { orderAmount, deliveryFeeCollected, fulfillmentType, handlesSelfDelivery } = payoutParams;

    const totalOrderValue = Number(orderAmount) || 0;
    const deliveryFee = Number(deliveryFeeCollected) || 0;
    const productSubtotal = totalOrderValue - deliveryFee;

    // Platform Commission (e.g., 10% on product subtotal)
    const platformCommission = Math.round(productSubtotal * VENDOR_CONFIG.COMMISSION_RATE);

    // Vendor Payout = Product Subtotal - Platform Commission
    const vendorNetPayout = productSubtotal - platformCommission;

    // Delivery Partner / Rider Payout
    let deliveryRiderPayout = 0;
    if (handlesSelfDelivery) {
      // If vendor / housewife handles delivery themselves, they keep the delivery fee
      deliveryRiderPayout = deliveryFee;
    } else {
      // If global aggregator rider fulfilled the delivery
      deliveryRiderPayout = deliveryFee; 
    }

    const totalVendorEarnings = vendorNetPayout + (handlesSelfDelivery ? deliveryRiderPayout : 0);

    return {
      success: true,
      currency: VENDOR_CONFIG.CURRENCY,
      breakdown: {
        totalOrderValue,
        productSubtotal,
        platformCommission,
        vendorNetPayout,
        deliveryFeeCollected: deliveryFee,
        deliveryRiderPayout,
        totalVendorEarnings
      },
      payoutStatus: 'PENDING_SETTLEMENT',
      timestamp: new Date().toISOString()
    };
  }
}

export const multiTierPayout = new MultiTierPayoutModule();
