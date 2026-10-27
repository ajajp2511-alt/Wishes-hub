/**
 * Sender Module - Global & Custom Coupon Card Marketplace
 * Path: admin/features/coupons/connection/coupons-sender.js
 */

import { eventBus } from '../../eventbus.js';

/**
 * Coupons module se kisi bhi event ko poore system me broadcast karne ke liye
 * @param {string} actionName - Event ka naam (e.g., 'BOOT_MARKETPLACE', 'CREATE_COUPON')
 * @param {Object} payloadData - Us event se juda data
 */
export function broadcastCouponsEvent(actionName, payloadData = {}) {
  eventBus.emit('GLOBAL_BROADCAST', {
    sourceModule: 'coupons',
    actionName: actionName,
    payload: payloadData
  });
}
