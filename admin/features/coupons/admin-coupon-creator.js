/**
 * Single Custom Coupon Creator & Validator Engine
 * Path: admin/features/coupons/admin-coupon-creator.js
 * Description: Enables admins to manually create custom store/brand coupons,
 *              validate inputs, set discount rules, stock limits, and secret PINs.
 */

import { couponsCore } from './coupons-core.js';

export class AdminCouponCreatorEngine {
  constructor() {
    this.core = couponsCore;
  }

  /**
   * Validate Coupon Creation Payload
   */
  validateCouponPayload(payload) {
    if (!payload.title || payload.title.trim().length < 3) {
      return { valid: false, reason: 'Coupon title must be at least 3 characters long.' };
    }
    if (!payload.brandName || payload.brandName.trim().length < 2) {
      return { valid: false, reason: 'Brand name is required.' };
    }
    if (!payload.faceValueINR || Number(payload.faceValueINR) <= 0) {
      return { valid: false, reason: 'Face value must be a positive number.' };
    }
    if (!payload.sellingPriceINR || Number(payload.sellingPriceINR) <= 0) {
      return { valid: false, reason: 'Selling price must be a positive number.' };
    }
    if (Number(payload.sellingPriceINR) > Number(payload.faceValueINR)) {
      return { valid: false, reason: 'Selling price cannot be higher than face value.' };
    }
    if (!payload.voucherCode || payload.voucherCode.trim().length < 4) {
      return { valid: false, reason: 'Voucher code must be at least 4 characters.' };
    }

    return { valid: true };
  }

  /**
   * Create & Store Single Custom Coupon
   */
  createCustomCoupon(rawPayload) {
    const validation = this.validateCouponPayload(rawPayload);
    if (!validation.valid) {
      this.core.log('COUPON_CREATOR', `Validation failed: ${validation.reason}`, 'WARN');
      return { success: false, error: validation.reason };
    }

    const faceVal = Number(rawPayload.faceValueINR);
    const sellPrice = Number(rawPayload.sellingPriceINR);
    const profitMargin = faceVal - sellPrice;

    const newCoupon = {
      id: 'CUST_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      title: rawPayload.title.trim(),
      brandName: rawPayload.brandName.trim(),
      category: rawPayload.category || 'General',
      faceValueINR: faceVal,
      sellingPriceINR: sellPrice,
      platformProfitINR: profitMargin,
      voucherCode: rawPayload.voucherCode.trim().toUpperCase(),
      secretPin: rawPayload.secretPin ? rawPayload.secretPin.trim() : null,
      stockCount: Number(rawPayload.stockCount) || 1,
      isCustomAdminCoupon: true,
      expiryDate: rawPayload.expiryDate || new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    };

    this.core.state.inventoryQueue.unshift(newCoupon);
    this.core.log('COUPON_CREATOR', `Successfully created custom coupon: ${newCoupon.title} [ID: ${newCoupon.id}]`, 'SUCCESS');
    
    return { success: true, coupon: newCoupon };
  }
}

export const adminCouponCreator = new AdminCouponCreatorEngine();
