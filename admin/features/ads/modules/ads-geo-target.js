/**
 * Wishes Hub - Geo-Fencing & Radius Target Engine
 * File: admin/features/ads/modules/ads-geo-target.js
 * Description: Matches active ad campaigns with user pincode, city, 
 *              and geographical location criteria.
 */

import { ADS_CONFIG } from '../ads-config.js';

export class AdsGeoTarget {
  constructor() {
    this.defaultCity = 'Pune';
  }

  /**
   * Filter active ads list based on visitor's current location info
   * @param {Array} activeAds 
   * @param {Object} userLocation (e.g., { city: 'Pune', pincode: '411002' })
   * @returns {Array} Matched ads list
   */
  filterAdsByLocation(activeAds, userLocation = {}) {
    const visitorCity = (userLocation.city || this.defaultCity).toLowerCase().trim();
    const visitorPincode = userLocation.pincode ? String(userLocation.pincode).trim() : null;

    return activeAds.filter(ad => {
      if (!ad || ad.status !== ADS_CONFIG.STATUS.ACTIVE) return false;

      const adScope = ad.areaScope;
      const adCity = (ad.city || '').toLowerCase().trim();

      // State-wide coverage displays everywhere
      if (adScope === 'STATE_WIDE') return true;

      // City-wide or Multi-district matching
      if (adScope === 'CITY_WIDE' || adScope === 'MULTI_DISTRICT') {
        return adCity === visitorCity || visitorCity.includes(adCity) || adCity.includes(visitorCity);
      }

      // Pincode level local targeting
      if (adScope === 'SINGLE_PINCODE') {
        if (ad.targetPincode && visitorPincode) {
          return ad.targetPincode === visitorPincode;
        }
        return adCity === visitorCity;
      }

      return true;
    });
  }
}
