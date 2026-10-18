/**
 * Wishes Hub - Smart Routing & Fallback Module
 * File: modules/smart-routing-fallback.js
 */

import { VENDOR_CONFIG } from '../local-vendors-config.js';
import { coreEngine } from '../local-vendors-core.js';

export class SmartRoutingFallbackModule {
  constructor() {
    this.moduleName = 'smart-routing-fallback';
  }

  /**
   * Route an order to the appropriate fulfillment channel
   * @param {Object} orderData 
   * @returns {Object} Routing result
   */
  routeOrder(orderData) {
    const { orderId, pincode, locality, distanceKm, preferredVendorId } = orderData;

    // 1. If a preferred local vendor/housewife is targeted
    if (preferredVendorId) {
      const vendor = coreEngine.state.activeVendors.get(preferredVendorId);
      if (vendor && vendor.status === 'OPEN') {
        coreEngine.updateOrderStatus(orderId, 'PENDING_VENDOR_RESPONSE', {
          vendorId: preferredVendorId,
          routingType: 'LOCAL_VENDOR'
        });

        // Set 5-minute response timeout timer
        this.initializeVendorTimeout(orderId, preferredVendorId);

        return {
          success: true,
          routedTo: 'LOCAL_VENDOR',
          vendorId: preferredVendorId,
          message: 'Order dispatched to local vendor/housewife WhatsApp. Waiting for 5-min response.'
        };
      }
    }

    // 2. Fallback to Global Aggregator Delivery API / Central Network
    coreEngine.updateOrderStatus(orderId, 'ROUTED_TO_AGGREGATOR', {
      routingType: 'GLOBAL_AGGREGATOR'
    });

    return {
      success: true,
      routedTo: 'GLOBAL_AGGREGATOR',
      vendorId: null,
      message: 'Local vendor unavailable. Order routed directly to global aggregator delivery network.'
    };
  }

  initializeVendorTimeout(orderId, vendorId) {
    setTimeout(() => {
      const order = coreEngine.state.activeOrders.get(orderId);
      if (order && order.status === 'PENDING_VENDOR_RESPONSE') {
        // Trigger auto-reroute to aggregator if vendor didn't respond within 5 mins
        coreEngine.updateOrderStatus(orderId, 'VENDOR_TIMEOUT_FALLBACK', {
          failedVendorId: vendorId
        });
        
        // Auto fallback dispatch
        this.routeOrder({
          orderId,
          preferredVendorId: null
        });
      }
    }, VENDOR_CONFIG.TIMEOUTS.LOCAL_SHOPKEEPER_MS);
  }
}

export const smartRoutingFallback = new SmartRoutingFallbackModule();
