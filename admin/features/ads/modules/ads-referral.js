/**
 * Wishes Hub - Merchant Referral Credit System
 * File: admin/features/ads/modules/ads-referral.js
 * Description: Enables local shopkeepers to invite other merchants 
 *              and earn 10% discount credits or extra validity days.
 */

export class AdsReferral {
  /**
   * Generate Referral Code for Merchant
   * @param {string} businessName 
   * @returns {string} Code
   */
  generateReferralCode(businessName) {
    const cleanName = businessName.toUpperCase().replace(/[^A-Z]/g, '').substr(0, 4);
    return `REF-${cleanName}-${Math.floor(100 + Math.random() * 900)}`;
  }
}
