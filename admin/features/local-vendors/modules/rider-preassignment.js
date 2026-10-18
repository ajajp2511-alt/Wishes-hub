/**
 * Wishes Hub - Rider Pre-Assignment & Allocation Module
 * File: modules/rider-preassignment.js
 */

import { coreEngine } from '../local-vendors-core.js';

export class RiderPreassignmentModule {
  constructor() {
    this.moduleName = 'rider-preassignment';
  }

  /**
   * Pre-assign a delivery rider (self-rider or aggregator fleet) to an order
   * @param {Object} assignmentParams 
   * @returns {Object} Assignment status
   */
  preassignRider(assignmentParams) {
    const { orderId, vendorId, riderName, riderPhone, isSelfDeliveryRider } = assignmentParams;

    if (!orderId) {
      throw new Error('Order ID is required for rider pre-assignment.');
    }

    const riderDetails = {
      riderName: riderName || (isSelfDeliveryRider ? 'Vendor Family Member / Local Rider' : 'Aggregator Express Partner'),
      riderPhone: riderPhone || null,
      isSelfDeliveryRider: Boolean(isSelfDeliveryRider),
      assignedAt: new Date().toISOString(),
      status: 'PRE_ASSIGNED'
    };

    // Update order state with rider info
    coreEngine.updateOrderStatus(orderId, 'RIDER_PRE_ASSIGNED', {
      assignedRider: riderDetails,
      vendorId: vendorId || null
    });

    return {
      success: true,
      orderId,
      message: 'Delivery rider successfully pre-assigned to order.',
      riderDetails
    };
  }
}

export const riderPreassignment = new RiderPreassignmentModule();
