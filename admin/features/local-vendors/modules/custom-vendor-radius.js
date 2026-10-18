/**
 * Wishes Hub - Custom Vendor Radius & Fleet Controller Module
 * File: modules/custom-vendor-radius.js
 */

import { coreEngine } from '../local-vendors-core.js';

export class CustomVendorRadiusModule {
  constructor() {
    this.moduleName = 'custom-vendor-radius';
  }

  /**
   * Update vendor's custom delivery radius in KM
   * @param {String} vendorId 
   * @param {Number} radiusKm 
   * @returns {Object} Result
   */
  updateRadius(vendorId, radiusKm) {
    const radius = Number(radiusKm);
    if (isNaN(radius) || radius <= 0) {
      throw new Error('Invalid radius value provided. Must be greater than 0 KM.');
    }

    const vendor = coreEngine.state.activeVendors.get(vendorId);
    if (!vendor) {
      throw new Error(`Vendor not found with ID: ${vendorId}`);
    }

    vendor.deliveryConfig.serviceRadiusKm = radius;
    coreEngine.setVendorState(vendorId, vendor);

    return {
      success: true,
      message: `Delivery radius successfully updated to ${radius} KM.`,
      vendorId,
      serviceRadiusKm: radius
    };
  }

  /**
   * Toggle Self-Rider mode (Enable/Disable vendor's own delivery person or family member)
   * @param {String} vendorId 
   * @param {Boolean} handlesSelfDelivery 
   * @returns {Object} Result
   */
  toggleSelfRider(vendorId, handlesSelfDelivery) {
    const vendor = coreEngine.state.activeVendors.get(vendorId);
    if (!vendor) {
      throw new Error(`Vendor not found with ID: ${vendorId}`);
    }

    vendor.deliveryConfig.handlesSelfDelivery = Boolean(handlesSelfDelivery);
    coreEngine.setVendorState(vendorId, vendor);

    return {
      success: true,
      message: `Self-delivery mode updated to: ${vendor.deliveryConfig.handlesSelfDelivery ? 'ACTIVE' : 'INACTIVE (Using Aggregator)'}`,
      vendorId,
      handlesSelfDelivery: vendor.deliveryConfig.handlesSelfDelivery
    };
  }

  /**
   * Check if target delivery distance falls within the vendor's defined radius
   * @param {String} vendorId 
   * @param {Number} distanceKm 
   * @returns {Boolean}
   */
  isWithinRadius(vendorId, distanceKm) {
    const vendor = coreEngine.state.activeVendors.get(vendorId);
    if (!vendor || !vendor.deliveryConfig) {
      return false;
    }
    return Number(distanceKm) <= Number(vendor.deliveryConfig.serviceRadiusKm);
  }
}

export const customVendorRadius = new CustomVendorRadiusModule();
