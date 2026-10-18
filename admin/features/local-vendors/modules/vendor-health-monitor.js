/**
 * Wishes Hub - Vendor Health & Auto-Pause Monitor Module
 * File: modules/vendor-health-monitor.js
 */

import { VENDOR_CONFIG } from '../local-vendors-config.js';
import { coreEngine } from '../local-vendors-core.js';

export class VendorHealthMonitorModule {
  constructor() {
    this.moduleName = 'vendor-health-monitor';
    this.maxConsecutiveRejections = 3;
    this.maxTimeoutLimit = 3;
  }

  /**
   * Monitor vendor response pattern and auto-pause inactive/unresponsive vendors
   * @param {String} vendorId 
   * @param {String} lastAction - 'ACCEPTED' | 'REJECTED' | 'TIMEOUT'
   * @returns {Object} Health check result
   */
  recordResponseEvent(vendorId, lastAction) {
    const vendor = coreEngine.state.activeVendors.get(vendorId);
    if (!vendor) {
      throw new Error(`Vendor not found with ID: ${vendorId}`);
    }

    if (!vendor.healthMetrics) {
      vendor.healthMetrics = {
        consecutiveRejections: 0,
        consecutiveTimeouts: 0,
        autoPaused: false,
        lastEventTimestamp: null
      };
    }

    const metrics = vendor.healthMetrics;
    metrics.lastEventTimestamp = new Date().toISOString();

    if (lastAction === 'ACCEPTED') {
      // Reset strike counters on successful order acceptance
      metrics.consecutiveRejections = 0;
      metrics.consecutiveTimeouts = 0;
    } else if (lastAction === 'REJECTED') {
      metrics.consecutiveRejections += 1;
    } else if (lastAction === 'TIMEOUT') {
      metrics.consecutiveTimeouts += 1;
    }

    let shouldAutoPause = false;
    let pauseReason = '';

    if (metrics.consecutiveRejections >= this.maxConsecutiveRejections) {
      shouldAutoPause = true;
      pauseReason = `Auto-paused: ${metrics.consecutiveRejections} consecutive order rejections.`;
    } else if (metrics.consecutiveTimeouts >= this.maxTimeoutLimit) {
      shouldAutoPause = true;
      pauseReason = `Auto-paused: ${metrics.consecutiveTimeouts} consecutive order response timeouts.`;
    }

    if (shouldAutoPause) {
      vendor.status = 'AUTO_PAUSED';
      metrics.autoPaused = true;
      metrics.pauseReason = pauseReason;
      coreEngine.setVendorState(vendorId, vendor);

      return {
        success: true,
        vendorId,
        autoPaused: true,
        reason: pauseReason,
        message: 'Vendor has been auto-paused due to consecutive unresponsiveness/rejections.'
      };
    }

    coreEngine.setVendorState(vendorId, vendor);

    return {
      success: true,
      vendorId,
      autoPaused: false,
      currentStrikes: {
        rejections: metrics.consecutiveRejections,
        timeouts: metrics.consecutiveTimeouts
      }
    };
  }

  /**
   * Unpause and reset vendor health strikes
   * @param {String} vendorId 
   * @returns {Object} Result
   */
  resetVendorHealth(vendorId) {
    const vendor = coreEngine.state.activeVendors.get(vendorId);
    if (!vendor) {
      throw new Error(`Vendor not found with ID: ${vendorId}`);
    }

    vendor.status = 'OPEN';
    vendor.healthMetrics = {
      consecutiveRejections: 0,
      consecutiveTimeouts: 0,
      autoPaused: false,
      pauseReason: null,
      lastEventTimestamp: new Date().toISOString()
    };

    coreEngine.setVendorState(vendorId, vendor);

    return {
      success: true,
      vendorId,
      message: 'Vendor health metrics reset. Store status reverted to OPEN.'
    };
  }
}

export const vendorHealthMonitor = new VendorHealthMonitorModule();
