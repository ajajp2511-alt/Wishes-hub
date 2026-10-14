/**
 * Wishes Hub - Local Advertiser CRM Profile Registry
 * File: admin/features/ads/modules/ads-advertiser.js
 * Description: Client database manager for local shops/businesses, 
 *              maintaining ownership records and ad campaign history.
 */

import { ADS_CONFIG } from '../ads-config.js';

export class AdsAdvertiser {
  constructor(coreInstance) {
    this.core = coreInstance;
  }

  /**
   * Register or Update Local Advertiser Profile
   * @param {Object} profileData 
   * @returns {Object} Saved Profile
   */
  registerAdvertiser(profileData) {
    const existingIndex = this.core.state.advertisers.findIndex(
      a => a.whatsapp === profileData.whatsapp
    );

    const updatedProfile = {
      advertiserId: existingIndex !== -1 
        ? this.core.state.advertisers[existingIndex].advertiserId 
        : 'ADV_' + Date.now(),
      businessName: profileData.businessName,
      contactName: profileData.contactName,
      whatsapp: profileData.whatsapp,
      city: profileData.city,
      registeredAt: existingIndex !== -1 
        ? this.core.state.advertisers[existingIndex].registeredAt 
        : new Date().toISOString(),
      lastActiveAt: new Date().toISOString()
    };

    if (existingIndex !== -1) {
      this.core.state.advertisers[existingIndex] = updatedProfile;
    } else {
      this.core.state.advertisers.push(updatedProfile);
    }

    this.core.setStorageItem(ADS_CONFIG.STORAGE_KEYS.ADVERTISERS, this.core.state.advertisers);
    return updatedProfile;
  }

  /**
   * Get Complete History of Ads for a Specific Advertiser
   * @param {string} whatsapp 
   * @returns {Array} List of Ads
   */
  getAdvertiserAdsHistory(whatsapp) {
    return this.core.state.activeAds.filter(ad => ad.whatsapp === whatsapp);
  }

  /**
   * Generate Direct WhatsApp Chat Link for Advertiser Communication
   * @param {string} whatsapp 
   * @param {string} defaultMessage 
   * @returns {string} WhatsApp URL
   */
  getWhatsAppDirectLink(whatsapp, defaultMessage = 'Hello! Regarding your Wishes Hub local ad campaign:') {
    const cleanNumber = whatsapp.replace(/\D/g, '');
    const formattedNumber = cleanNumber.length === 10 ? '91' + cleanNumber : cleanNumber;
    return `https://wa.me/${formattedNumber}?text=${encodeURIComponent(defaultMessage)}`;
  }
}
