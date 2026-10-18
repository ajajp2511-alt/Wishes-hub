/**
 * Wishes Hub - WhatsApp Status Control Module
 * File: modules/whatsapp-status-control.js
 */

import { VENDOR_CONFIG } from '../local-vendors-config.js';
import { coreEngine } from '../local-vendors-core.js';

export class WhatsappStatusControlModule {
  constructor() {
    this.moduleName = 'whatsapp-status-control';
  }

  /**
   * Process incoming WhatsApp text commands from vendors/housewives
   * Commands supported: OPEN, CLOSE, PAUSE, RADIUS <km>, YES, NO
   * @param {String} whatsappNumber 
   * @param {String} incomingMessage 
   * @returns {Object} Action response
   */
  handleIncomingCommand(whatsappNumber, incomingMessage) {
    const cleanMsg = incomingMessage.trim().toUpperCase();
    const vendorId = this.findVendorByWhatsApp(whatsappNumber);

    if (!vendorId) {
      return {
        success: false,
        replyMessage: 'Namaste! Your WhatsApp number is not registered with Wishes Hub. Please complete onboarding first.'
      };
    }

    const vendor = coreEngine.state.activeVendors.get(vendorId);

    // 1. OPEN Command
    if (cleanMsg === VENDOR_CONFIG.WHATSAPP_COMMANDS.OPEN) {
      vendor.status = 'OPEN';
      coreEngine.setVendorState(vendorId, vendor);
      return {
        success: true,
        replyMessage: `🟢 Store Status: OPEN. You are now live to receive local orders!`
      };
    }

    // 2. CLOSE / PAUSE Command
    if (cleanMsg === VENDOR_CONFIG.WHATSAPP_COMMANDS.CLOSE || cleanMsg === VENDOR_CONFIG.WHATSAPP_COMMANDS.PAUSE) {
      vendor.status = 'CLOSED';
      coreEngine.setVendorState(vendorId, vendor);
      return {
        success: true,
        replyMessage: `🔴 Store Status: CLOSED. You will not receive any new orders until you reply OPEN.`
      };
    }

    // 3. RADIUS Command (e.g., "RADIUS 3" or "RADIUS 5")
    if (cleanMsg.startsWith('RADIUS ')) {
      const parts = cleanMsg.split(' ');
      const km = Number(parts[1]);
      if (isNaN(km) || km <= 0) {
        return {
          success: false,
          replyMessage: '⚠️ Invalid format. Please send like this: RADIUS 3'
        };
      }
      vendor.deliveryConfig.serviceRadiusKm = km;
      coreEngine.setVendorState(vendorId, vendor);
      return {
        success: true,
        replyMessage: `📍 Your delivery radius has been successfully updated to ${km} KM.`
      };
    }

    // 4. Order Acceptance/Rejection (YES / NO)
    if (VENDOR_CONFIG.WHATSAPP_COMMANDS.ACCEPT.includes(cleanMsg)) {
      return this.handleOrderResponse(vendorId, 'ACCEPTED');
    }

    if (VENDOR_CONFIG.WHATSAPP_COMMANDS.REJECT.includes(cleanMsg)) {
      return this.handleOrderResponse(vendorId, 'REJECTED');
    }

    return {
      success: false,
      replyMessage: '⚠️ Unrecognized command. Send OPEN, CLOSE, RADIUS <km>, YES or NO.'
    };
  }

  findVendorByWhatsApp(number) {
    for (const [vendorId, vendor] of coreEngine.state.activeVendors.entries()) {
      if (vendor.whatsappNumber === number || vendor.contactNumber === number) {
        return vendorId;
      }
    }
    return null;
  }

  handleOrderResponse(vendorId, responseStatus) {
    // Find active pending order assigned to this vendor
    let targetOrderId = null;
    for (const [orderId, order] of coreEngine.state.activeOrders.entries()) {
      if (order.vendorId === vendorId && order.status === 'PENDING_VENDOR_RESPONSE') {
        targetOrderId = orderId;
        break;
      }
    }

    if (!targetOrderId) {
      return {
        success: false,
        replyMessage: '⚠️ No pending orders found awaiting your response right now.'
      };
    }

    if (responseStatus === 'ACCEPTED') {
      coreEngine.updateOrderStatus(targetOrderId, 'VENDOR_ACCEPTED', { acceptedBy: vendorId });
      return {
        success: true,
        replyMessage: '✅ Order Accepted! Please start preparation and keep delivery ready within schedule.'
      };
    } else {
      coreEngine.updateOrderStatus(targetOrderId, 'VENDOR_REJECTED', { rejectedBy: vendorId });
      return {
        success: true,
        replyMessage: '❌ Order declined. The system is routing it to the backup aggregator network.'
      };
    }
  }
}

export const whatsappStatusControl = new WhatsappStatusControlModule();
