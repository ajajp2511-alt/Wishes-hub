/**
 * Wishes Hub - Serviceability Zone Checker & Routing Module
 * File: modules/serviceability-zone-checker.js
 */

import { coreEngine } from '../local-vendors-core.js';

export class ServiceabilityZoneCheckerModule {
  constructor() {
    this.moduleName = 'serviceability-zone-checker';
  }

  /**
   * Real-time pre-checkout address serviceability and routing check
   * @param {Object} checkParams 
   * @returns {Object} Serviceability status, delivery mode, and fulfillment source
   */
  checkServiceability(checkParams) {
    const { pincode, locality, distanceKm } = checkParams;

    if (!pincode) {
      return {
        serviceable: false,
        message: 'Pincode is required to check delivery serviceability.'
      };
    }

    // 1. Check for Active Local Vendor / Housewife in the Pincode / Locality
    let matchedVendor = null;
    for (const [vendorId, vendor] of coreEngine.state.activeVendors.entries()) {
      const matchesPincode = vendor.location.pincode === pincode;
      const matchesLocality = locality && vendor.location.villageOrLocality?.toLowerCase() === locality.toLowerCase();

      if (matchesPincode || matchesLocality) {
        // Verify if vendor is currently OPEN / Active
        if (vendor.status === 'OPEN' || vendor.status === 'ACTIVE') {
          const radius = vendor.deliveryConfig?.serviceRadiusKm || 3;
          // If distance is within vendor's defined custom radius
          if (!distanceKm || Number(distanceKm) <= Number(radius)) {
            matchedVendor = vendor;
            break;
          }
        }
      }
    }

    // 2. Return Local Vendor / Housewife Routing Response if Found
    if (matchedVendor) {
      const isHousewife = matchedVendor.vendorType === 'HOME_MAKER';
      const handlesSelf = matchedVendor.deliveryConfig.handlesSelfDelivery;

      return {
        serviceable: true,
        deliveryMode: handlesSelf ? 'SELF_RIDER' : 'GLOBAL_AGGREGATOR',
        fulfillmentSource: isHousewife ? 'HOME_MAKER_VENDOR' : 'COMMERCIAL_VENDOR',
        vendorId: matchedVendor.vendorId,
        vendorName: matchedVendor.businessName,
        estimatedPrepMinutes: matchedVendor.operationalConfig?.prepTimeMinutes || 120,
        message: `Delivery Available! Handled locally by ${matchedVendor.businessName}.`
      };
    }

    // 3. Fallback to Global Aggregator Delivery API Coverage Check
    const isAggregatorCovered = this.verifyGlobalAggregatorCoverage(pincode);

    if (isAggregatorCovered) {
      return {
        serviceable: true,
        deliveryMode: 'GLOBAL_AGGREGATOR',
        fulfillmentSource: 'CENTRAL_PARTNER_NETWORK',
        vendorId: null,
        vendorName: 'Wishes Hub Central Partner Network',
        message: 'Delivery Available via Express Logistics Partner.'
      };
    }

    // 4. Non-Serviceable Response
    return {
      serviceable: false,
      deliveryMode: 'NONE',
      fulfillmentSource: 'NONE',
      message: 'Currently non-serviceable area for instant or midnight deliveries.'
    };
  }

  verifyGlobalAggregatorCoverage(pincode) {
    // Mock validator for global aggregator API coverage based on standard valid pincodes
    return typeof pincode === 'string' && pincode.trim().length === 6;
  }
}

export const serviceabilityZoneChecker = new ServiceabilityZoneCheckerModule();
