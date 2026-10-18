/**
 * Wishes Hub - Vendor Onboarding Module (Commercial & Housewife / Home-Maker)
 * File: modules/vendor-onboarding.js
 */

import { VENDOR_CONFIG } from '../local-vendors-config.js';
import { coreEngine } from '../local-vendors-core.js';

export class VendorOnboardingModule {
  constructor() {
    this.moduleName = 'vendor-onboarding';
  }

  /**
   * Process 5-Step B2B / Home-Maker Registration Form Data
   * @param {Object} formData 
   * @returns {Object} Registration Result & Status
   */
  registerVendor(formData) {
    try {
      this.validatePayload(formData);

      const vendorId = `VEN_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      
      const vendorRecord = {
        vendorId,
        businessName: formData.businessName || formData.fullName,
        vendorType: formData.vendorType || VENDOR_CONFIG.VENDOR_TYPES.HOME_MAKER,
        category: formData.category, // e.g., 'Home-made Sweets', 'Bakery', 'Handmade Crafts'
        contactNumber: formData.contactNumber,
        whatsappNumber: formData.whatsappNumber || formData.contactNumber,
        location: {
          pincode: formData.pincode,
          villageOrLocality: formData.villageOrLocality,
          address: formData.address,
          coordinates: formData.coordinates || null
        },
        deliveryConfig: {
          handlesSelfDelivery: formData.handlesSelfDelivery === true, // TRUE for Housewives handling local village/area delivery
          serviceRadiusKm: Number(formData.serviceRadiusKm) || 3,
          allowedPockets: formData.allowedPockets || []
        },
        operationalConfig: {
          prepTimeMinutes: Number(formData.prepTimeMinutes) || 120, // Default 2 hours lead time for home-makers
          maxDailyOrders: Number(formData.maxDailyOrders) || 5
        },
        status: 'PENDING_APPROVAL',
        kycVerified: false,
        registeredAt: new Date().toISOString()
      };

      // Store in Core State
      coreEngine.setVendorState(vendorId, vendorRecord);

      return {
        success: true,
        message: 'Vendor registration submitted successfully.',
        vendorId,
        nextStep: 'Awaiting Admin / WhatsApp Verification'
      };

    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  validatePayload(data) {
    if (!data.contactNumber || !data.pincode) {
      throw new Error('Missing mandatory contact number or pincode for onboarding.');
    }
    if (!data.vendorType) {
      throw new Error('Vendor type (Commercial Shop or Home-Maker) is required.');
    }
  }
}

export const vendorOnboarding = new VendorOnboardingModule();
