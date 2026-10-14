/**
 * Wishes Hub - Festival Deals & Surge Packages Manager
 * File: admin/features/ads/modules/ads-festival-deals.js
 * Description: Special festive season campaign passes and dynamic discounts.
 */

export class AdsFestivalDeals {
  /**
   * Get Active Festival Deals
   * @returns {Array} Festival Packages List
   */
  getFestivePasses() {
    return [
      {
        id: 'PASS_DIWALI_2026',
        title: 'Diwali Grand Local Sponsor Pass',
        durationDays: 10,
        flatDiscountPercent: 20,
        includesVideoAddon: true,
        description: '10 Days Header Banner + Free Video Pre-Roll for local sweets & gifts shops.'
      }
    ];
  }
}
