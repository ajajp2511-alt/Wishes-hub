/**
 * Wishes Hub - Embedded Delivery Pricing & Cost Deduction Module
 * File: modules/embedded-delivery-pricing.js
 */

export class EmbeddedDeliveryPricingModule {
  constructor() {
    this.moduleName = 'embedded-delivery-pricing';
  }

  /**
   * Calculate delivery cost and determine who bears the charge (Platform, Vendor, or Sender)
   * @param {Object} pricingParams 
   * @returns {Object} Pricing breakdown
   */
  calculateDeliveryFee(pricingParams) {
    const { distanceKm, orderValue, isFreeDeliveryPromo } = pricingParams;

    const baseFare = 30; // ₹30 base fare
    const perKmRate = 12; // ₹12 per KM rate
    const calculatedFee = baseFare + (Number(distanceKm || 1) * perKmRate);

    // If order qualifies for free delivery promo or minimum cart value
    if (isFreeDeliveryPromo || Number(orderValue) >= 499) {
      return {
        deliveryFeeChargedToCustomer: 0,
        actualDeliveryCost: calculatedFee,
        absorbedBy: 'PLATFORM_OR_VENDOR',
        message: 'Free Delivery Applied!'
      };
    }

    return {
      deliveryFeeChargedToCustomer: calculatedFee,
      actualDeliveryCost: calculatedFee,
      absorbedBy: 'CUSTOMER',
      message: `Standard Delivery Fee: ₹${calculatedFee}`
    };
  }
}

export const embeddedDeliveryPricing = new EmbeddedDeliveryPricingModule();
