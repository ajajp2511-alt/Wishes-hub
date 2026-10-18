/**
 * Wishes Hub - Anonymous Gifting & Secret Code Module
 * File: modules/anonymous-gifting-codes.js
 */

import { coreEngine } from '../local-vendors-core.js';

export class AnonymousGiftingCodesModule {
  constructor() {
    this.moduleName = 'anonymous-gifting-codes';
  }

  /**
   * Generate a secure secret code for anonymous gift validation and delivery pickup
   * @param {String} orderId 
   * @returns {Object} Generated secret token
   */
  generateSecretCode(orderId) {
    if (!orderId) {
      throw new Error('Order ID is required to generate a secret gifting code.');
    }

    const secretCode = `WH-SEC-${Math.floor(1000 + Math.random() * 9000)}`;

    const order = coreEngine.state.activeOrders.get(orderId) || {};
    order.anonymousSecretCode = secretCode;
    coreEngine.state.activeOrders.set(orderId, order);

    return {
      success: true,
      orderId,
      secretCode,
      message: 'Secret anonymous verification code generated successfully.'
    };
  }

  /**
   * Verify secret code presented by recipient during anonymous delivery
   * @param {String} orderId 
   * @param {String} enteredCode 
   * @returns {Object} Verification result
   */
  verifySecretCode(orderId, enteredCode) {
    const order = coreEngine.state.activeOrders.get(orderId);
    if (!order) {
      throw new Error(`Order not found with ID: ${orderId}`);
    }

    if (!order.anonymousSecretCode) {
      return {
        success: false,
        message: 'No secret code requirement exists for this order.'
      };
    }

    const isMatch = order.anonymousSecretCode.trim() === enteredCode.trim();

    return {
      success: isMatch,
      message: isMatch ? 'Secret code verified successfully!' : 'Incorrect secret code entered.'
    };
  }
}

export const anonymousGiftingCodes = new AnonymousGiftingCodesModule();
