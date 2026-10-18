/**
 * Wishes Hub - Local Vendor Engine Configuration & Constants
 * File: local-vendors-config.js
 */

export const VENDOR_CONFIG = {
  // Acceptance Timeout Limits (in milliseconds)
  TIMEOUTS: {
    EXPRESS_HOUSEWIFE_MS: 2 * 60 * 1000, // 2 Minutes
    LOCAL_SHOPKEEPER_MS: 5 * 60 * 1000,  // 5 Minutes
    AGGREGATOR_REROUTE_MS: 15 * 60 * 1000 // 15 Minutes Fallback
  },

  // Commission & Financial Defaults
  COMMISSION_RATE: 0.10, // 10% Platform Commission
  CURRENCY: 'INR',

  // Delivery Modes
  DELIVERY_TYPES: {
    SELF_RIDER: 'SELF_RIDER',
    GLOBAL_AGGREGATOR: 'GLOBAL_AGGREGATOR',
    CENTRAL_HUB: 'CENTRAL_HUB'
  },

  // Vendor Types
  VENDOR_TYPES: {
    COMMERCIAL_SHOP: 'COMMERCIAL_SHOP',
    HOME_MAKER: 'HOME_MAKER'
  },

  // WhatsApp Command Trigger Terms
  WHATSAPP_COMMANDS: {
    ACCEPT: ['YES', 'ACCEPT', '1'],
    REJECT: ['NO', 'REJECT', '0'],
    OPEN: 'OPEN',
    CLOSE: 'CLOSE',
    PAUSE: 'PAUSE'
  }
};
