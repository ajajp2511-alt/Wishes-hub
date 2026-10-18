/**
 * Wishes Hub - Sender & Recipient Metadata Engine Module
 * File: modules/metadata-engine.js
 */

import { coreEngine } from '../local-vendors-core.js';

export class MetadataEngineModule {
  constructor() {
    this.moduleName = 'metadata-engine';
  }

  /**
   * Attach sender, recipient, wish notes, and delivery preferences to an order
   * @param {String} orderId 
   * @param {Object} metadataPayload 
   * @returns {Object} Result
   */
  attachMetadata(orderId, metadataPayload) {
    if (!orderId) {
      throw new Error('Order ID is required to attach metadata.');
    }

    const formattedMetadata = {
      sender: {
        name: metadataPayload.senderName || 'Anonymous Sender',
        phone: metadataPayload.senderPhone || null,
        isAnonymous: Boolean(metadataPayload.isAnonymous)
      },
      recipient: {
        name: metadataPayload.recipientName,
        phone: metadataPayload.recipientPhone,
        alternatePhone: metadataPayload.recipientAlternatePhone || null,
        fullAddress: metadataPayload.recipientAddress,
        landmark: metadataPayload.landmark || null,
        pincode: metadataPayload.pincode
      },
      greetings: {
        wishMessage: metadataPayload.wishMessage || 'Best Wishes!',
        cardTitle: metadataPayload.cardTitle || 'A Special Surprise For You',
        specialInstructions: metadataPayload.specialInstructions || null
      },
      attachedAt: new Date().toISOString()
    };

    coreEngine.updateOrderStatus(orderId, 'METADATA_ATTACHED', {
      metadata: formattedMetadata
    });

    return {
      success: true,
      orderId,
      message: 'Sender and recipient metadata attached successfully.',
      metadata: formattedMetadata
    };
  }

  /**
   * Retrieve vendor-sanitized metadata (Hides sender phone if anonymous requested)
   * @param {String} orderId 
   * @returns {Object} Vendor viewable metadata
   */
  getVendorSanitizedMetadata(orderId) {
    const order = coreEngine.state.activeOrders.get(orderId);
    if (!order || !order.metadata) {
      throw new Error(`No metadata found for Order ID: ${orderId}`);
    }

    const { sender, recipient, greetings } = order.metadata;

    return {
      recipientName: recipient.name,
      recipientPhone: recipient.phone,
      recipientAddress: recipient.fullAddress,
      landmark: recipient.landmark,
      wishMessage: greetings.wishMessage,
      specialInstructions: greetings.specialInstructions,
      senderDisplayName: sender.isAnonymous ? 'A Well Wisher (Secret)' : sender.name
    };
  }
}

export const metadataEngine = new MetadataEngineModule();
