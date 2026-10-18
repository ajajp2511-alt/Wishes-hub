/**
 * Wishes Hub - Midnight & Timed Event Scheduler Module
 * File: modules/midnight-event-scheduler.js
 */

import { coreEngine } from '../local-vendors-core.js';

export class MidnightEventSchedulerModule {
  constructor() {
    this.moduleName = 'midnight-event-scheduler';
  }

  /**
   * Schedule a timed order (e.g., Midnight Birthday/Anniversary surprise delivery)
   * @param {Object} scheduleParams 
   * @returns {Object} Scheduling result
   */
  scheduleTimedOrder(scheduleParams) {
    const { orderId, targetTimestamp, vendorId } = scheduleParams;

    if (!orderId || !targetTimestamp) {
      throw new Error('Order ID and target timestamp are required for scheduling.');
    }

    const scheduledTime = new Date(targetTimestamp).getTime();
    const currentTime = new Date().getTime();

    if (scheduledTime <= currentTime) {
      return {
        success: false,
        message: 'Target delivery time must be in the future.'
      };
    }

    const delayMs = scheduledTime - currentTime;

    // Update order status to scheduled
    coreEngine.updateOrderStatus(orderId, 'SCHEDULED_FOR_LATER', {
      targetTimestamp,
      vendorId: vendorId || null
    });

    // Set timer to trigger dispatch when the scheduled time arrives
    setTimeout(() => {
      this.triggerScheduledDispatch(orderId, vendorId);
    }, delayMs);

    return {
      success: true,
      orderId,
      targetTimestamp,
      message: `Order successfully scheduled for delivery at ${targetTimestamp}.`
    };
  }

  triggerScheduledDispatch(orderId, vendorId) {
    const order = coreEngine.state.activeOrders.get(orderId);
    if (order && order.status === 'SCHEDULED_FOR_LATER') {
      coreEngine.updateOrderStatus(orderId, 'DISPATCH_READY', {
        triggeredAt: new Date().toISOString()
      });
    }
  }
}

export const midnightEventScheduler = new MidnightEventSchedulerModule();
