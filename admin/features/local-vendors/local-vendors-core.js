/**
 * Wishes Hub - Local Vendor Core State Manager & Event Bus
 * File: local-vendors-core.js
 */

export class LocalVendorsCore {
  constructor() {
    this.state = {
      activeVendors: new Map(),
      activeOrders: new Map(),
      serviceabilityCache: new Map()
    };
    this.listeners = {};
  }

  // Simple Event Bus Implementation
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(fn => fn(data));
    }
  }

  // Register or Update Vendor State
  setVendorState(vendorId, vendorData) {
    this.state.activeVendors.set(vendorId, {
      ...this.state.activeVendors.get(vendorId),
      ...vendorData,
      updatedAt: new Date().toISOString()
    });
    this.emit('vendorStateChanged', { vendorId, data: vendorData });
  }

  // Track Order Status Lifecycle
  updateOrderStatus(orderId, status, payload = {}) {
    const currentOrder = this.state.activeOrders.get(orderId) || {};
    const updatedOrder = {
      ...currentOrder,
      orderId,
      status,
      ...payload,
      lastUpdated: new Date().toISOString()
    };
    this.state.activeOrders.set(orderId, updatedOrder);
    this.emit('orderStatusUpdated', updatedOrder);
  }
}

export const coreEngine = new LocalVendorsCore();
