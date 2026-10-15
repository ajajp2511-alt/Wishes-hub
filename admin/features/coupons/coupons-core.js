/**
 * Core State & Event Controller Engine
 * Path: admin/features/coupons/coupons-core.js
 * Description: Central state store, logging utility, queue manager, and event dispatcher
 *              for the Coupon Marketplace Module.
 */

import { COUPONS_CONFIG } from './coupons-config.js';

export class CouponsCoreEngine {
  constructor() {
    this.config = COUPONS_CONFIG;
    this.state = {
      initialized: false,
      activeCategories: ['All', 'E-Commerce', 'Food & Dining', 'Entertainment', 'Fashion', 'Gaming', 'Travel'],
      inventoryQueue: [],
      activeTransactions: [],
      partnerApplications: [],
      userWalletBalance: 0,
      logs: []
    };
    this.listeners = {};
  }

  /**
   * Boot Core Engine
   */
  async initialize() {
    try {
      this.state.initialized = true;
      this.log('CORE', 'Coupons Marketplace Core Engine Initialized Successfully.', 'SUCCESS');
      return { success: true };
    } catch (error) {
      this.log('CORE', `Initialization failed: ${error.message}`, 'ERROR');
      return { success: false, error: error.message };
    }
  }

  /**
   * Structured Logging Engine
   */
  log(module, message, level = 'INFO') {
    const logEntry = {
      timestamp: new Date().toISOString(),
      module,
      message,
      level
    };

    this.state.logs.unshift(logEntry);

    // Keep internal log buffer capped at 500 entries
    if (this.state.logs.length > 500) {
      this.state.logs.pop();
    }

    if (level === 'ERROR') {
      console.error(`[COUPONS MARKETPLACE][${module}]`, message);
    } else if (level === 'WARN') {
      console.warn(`[COUPONS MARKETPLACE][${module}]`, message);
    } else {
      console.log(`[COUPONS MARKETPLACE][${module}]`, message);
    }
  }

  /**
   * Internal Event Pub/Sub Dispatcher
   */
  subscribe(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  emit(event, payload) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(payload));
    }
  }
}

export const couponsCore = new CouponsCoreEngine();
