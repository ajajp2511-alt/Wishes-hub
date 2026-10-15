/**
 * Dynamic Card Bundles, Festive Packs & Combo Discount Calculator
 * Path: admin/features/coupons/bundle-combo-builder.js
 * Description: Groups multiple brand vouchers into discounted festive combos
 *              (e.g., Festival Shopping Pack: Amazon + Swiggy + Netflix).
 */

import { couponsCurrencyConverter } from './coupons-currency-converter.js';

export class BundleComboBuilderEngine {
  constructor() {
    this.converter = couponsCurrencyConverter;
    
    // Preset Festive Combos
    this.presetCombos = [
      {
        comboId: 'COMBO_FESTIVE_SHOPPING',
        title: 'Mega Festive Shopping Pack',
        description: 'Includes Amazon ₹500 + Swiggy ₹300 + Flipkart ₹500 Vouchers',
        originalTotalINR: 1300,
        comboSellingPriceINR: 1099,
        savingsINR: 201,
        items: ['Amazon Pay ₹500', 'Swiggy ₹300', 'Flipkart ₹500'],
        badge: 'BEST VALUE COMBO'
      },
      {
        comboId: 'COMBO_ENTERTAINMENT',
        title: 'Ultimate Entertainment Pass',
        description: 'Includes Netflix ₹500 + Google Play ₹400 Vouchers',
        originalTotalINR: 900,
        comboSellingPriceINR: 799,
        savingsINR: 101,
        items: ['Netflix ₹500', 'Google Play ₹400'],
        badge: 'POPULAR'
      }
    ];
  }

  /**
   * Get All Available Bundles
   */
  getAllCombos() {
    return this.presetCombos.map(combo => ({
      ...combo,
      formattedOriginalTotal: this.converter.format(combo.originalTotalINR),
      formattedSellingPrice: this.converter.format(combo.comboSellingPriceINR),
      formattedSavings: this.converter.format(combo.savingsINR)
    }));
  }
}

export const bundleComboBuilder = new BundleComboBuilderEngine();
