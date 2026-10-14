/**
 * Wishes Hub - Priority-based Ad Rotator Engine
 * File: admin/features/ads/modules/ads-rotator.js
 * Description: Rotates multiple active local ads in a single zone fairly 
 *              using weighted priority and round-robin queuing.
 */

export class AdsRotator {
  constructor() {
    this.zonePointers = {};
  }

  /**
   * Pick next active ad for display in specified zone using rotation
   * @param {string} zoneId 
   * @param {Array} eligibleAds 
   * @returns {Object|null} Selected Ad
   */
  getNextAdForZone(zoneId, eligibleAds = []) {
    const zoneAds = eligibleAds.filter(ad => ad.zoneId === zoneId);

    if (!zoneAds || zoneAds.length === 0) {
      return null;
    }

    if (zoneAds.length === 1) {
      return zoneAds[0];
    }

    // Initialize round robin pointer for zone if missing
    if (typeof this.zonePointers[zoneId] === 'undefined') {
      this.zonePointers[zoneId] = 0;
    }

    // Pick current ad and advance pointer
    const selectedIndex = this.zonePointers[zoneId] % zoneAds.length;
    const selectedAd = zoneAds[selectedIndex];

    this.zonePointers[zoneId] = (this.zonePointers[zoneId] + 1) % zoneAds.length;

    return selectedAd;
  }
}
