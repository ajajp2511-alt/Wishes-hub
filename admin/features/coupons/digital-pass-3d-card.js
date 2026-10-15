/**
 * Metallic Digital Pass UI & 3D Tilt Renderer
 * Path: admin/features/coupons/digital-pass-3d-card.js
 * Description: Generates metadata and CSS layout properties for premium 
 *              metallic gradient digital gift passes with brand badges.
 */

import { couponsCurrencyConverter } from './coupons-currency-converter.js';

export class DigitalPass3DCardEngine {
  constructor() {
    this.converter = couponsCurrencyConverter;
  }

  /**
   * Generate 3D Card Pass Visual Properties
   */
  renderPassCardMetadata(couponItem) {
    const isPremium = couponItem.faceValueINR >= 1000;
    
    return {
      cardId: couponItem.id,
      title: couponItem.title,
      brandName: couponItem.brandName,
      formattedFaceValue: this.converter.format(couponItem.faceValueINR),
      formattedSellingPrice: this.converter.format(couponItem.sellingPriceINR),
      themeStyle: isPremium ? 'metallic-gold-gradient' : 'sleek-silver-gradient',
      badgeText: isPremium ? 'VIP ELITE PASS' : 'STANDARD VOUCHER',
      securityMasked: true,
      tiltEffectEnabled: true
    };
  }
}

export const digitalPass3DCard = new DigitalPass3DCardEngine();
