/**
 * Wishes Hub - Delivery Proof Capture & Verification Module
 * File: modules/delivery-proof-capture.js
 */

import { coreEngine } from '../local-vendors-core.js';

export class DeliveryProofCaptureModule {
  constructor() {
    this.moduleName = 'delivery-proof-capture';
  }

  /**
   * Verify delivery via OTP or capture delivery confirmation proof
   * @param {Object} proofParams 
   * @returns {Object} Verification result
   */
  verifyAndCompleteDelivery(proofParams) {
    const { orderId, deliveryOtp, photoUrl, recipientSignature } = proofParams;

    const order = coreEngine.state.activeOrders.get(orderId);
    if (!order) {
      throw new Error(`Order not found with ID: ${orderId}`);
    }

    // Optional OTP check if generated during dispatch
    if (order.deliveryOtp && order.deliveryOtp !== deliveryOtp) {
      return {
        success: false,
        message: 'Invalid delivery verification OTP provided.'
      };
    }

    const proofRecord = {
      orderId,
      verifiedAt: new Date().toISOString(),
      proofType: photoUrl ? 'PHOTO_CONFIRMATION' : (recipientSignature ? 'SIGNATURE' : 'OTP_VERIFIED'),
      photoUrl: photoUrl || null,
      recipientSignature: recipientSignature || null,
      status: 'DELIVERED_SUCCESSFULLY'
    };

    // Update order state
    coreEngine.updateOrderStatus(orderId, 'DELIVERED', { deliveryProof: proofRecord });

    return {
      success: true,
      message: 'Delivery successfully completed and verified!',
      proofRecord
    };
  }
}

export const deliveryProofCapture = new DeliveryProofCaptureModule();
