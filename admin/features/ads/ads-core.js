/**
 * Wishes Hub - Ads Management Module Core
 * File: admin/features/ads/ads-core.js
 * Description: Master state manager, local draft storage controller, 
 *              and dynamic pricing calculation engine.
 */

import { ADS_CONFIG } from './ads-config.js';

export class AdsCore {
  constructor() {
    this.state = {
      activeAds: [],
      pendingRequests: [],
      advertisers: [],
      selectedDraft: null
    };
    this.initCore();
  }

  /**
   * Initialize Core Data Pipelines & Read Local Storage State
   */
  initCore() {
    this.state.activeAds = this.getStorageItem(ADS_CONFIG.STORAGE_KEYS.ACTIVE_ADS, []);
    this.state.pendingRequests = this.getStorageItem(ADS_CONFIG.STORAGE_KEYS.PENDING_REQUESTS, []);
    this.state.advertisers = this.getStorageItem(ADS_CONFIG.STORAGE_KEYS.ADVERTISERS, []);
  }

  /**
   * Calculate Dynamic Ad Price based on Area Multiplier, Zone Base Price, and Duration
   * @param {string} zoneId 
   * @param {string} areaKey 
   * @param {number} days 
   * @param {boolean} isVideo 
   * @returns {Object} Price Breakdown
   */
  calculateDynamicPrice(zoneId, areaKey, days, isVideo = false) {
    const zone = ADS_CONFIG.ZONES[zoneId] || ADS_CONFIG.ZONES.WISH_HEADER;
    const area = ADS_CONFIG.AREA_MULTIPLIERS[areaKey] || ADS_CONFIG.AREA_MULTIPLIERS.SINGLE_PINCODE;
    
    let baseRate = zone.basePricePerDay;
    if (isVideo) baseRate *= 1.4; // 40% premium for video processing

    const rawTotal = baseRate * area.multiplier * Math.max(1, days);
    
    // Apply duration discount if applicable
    let discountPercent = 0;
    if (days >= 30) discountPercent = 15;
    else if (days >= 15) discountPercent = 10;

    const discountAmount = (rawTotal * discountPercent) / 100;
    const finalAmount = Math.round(rawTotal - discountAmount);

    return {
      baseRatePerDay: baseRate,
      areaMultiplier: area.multiplier,
      durationDays: days,
      rawTotal: Math.round(rawTotal),
      discountAmount: Math.round(discountAmount),
      finalAmount: Math.max(0, finalAmount)
    };
  }

  /**
   * Save a New Advertiser Request into Local Pending Drafts Queue
   * (Remains in Local Storage until Super Admin approves)
   * @param {Object} requestData 
   * @returns {Object} Saved Record
   */
  savePendingRequest(requestData) {
    const id = 'REQ_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    const newRequest = {
      id,
      ...requestData,
      status: requestData.isFreeRequest ? ADS_CONFIG.STATUS.FREE_TEMPLATE_REQUEST : ADS_CONFIG.STATUS.PENDING_APPROVAL,
      createdAt: new Date().toISOString(),
      aiRetriesUsed: 0
    };

    this.state.pendingRequests.push(newRequest);
    this.setStorageItem(ADS_CONFIG.STORAGE_KEYS.PENDING_REQUESTS, this.state.pendingRequests);
    return newRequest;
  }

  /**
   * Get Local Storage Helper
   */
  getStorageItem(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.warn(`[AdsCore] Storage Read Error for key ${key}:`, e);
      return fallback;
    }
  }

  /**
   * Set Local Storage Helper
   */
  setStorageItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`[AdsCore] Storage Write Error for key ${key}:`, e);
    }
  }
    }
