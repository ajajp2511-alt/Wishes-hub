/**
 * Sender Module - WishesPay Global Engine & Refunds
 * Path: admin/features/pay-and-refund/connection/pay-and-refund-sender.js
 */

import { eventBus } from '../../eventbus.js';

/**
 * Pay and Refund module se kisi bhi event ko poore system me broadcast karne ke liye
 * @param {string} actionName - Event ka naam (e.g., 'INIT', 'PROCESS_PAYMENT')
 * @param {Object} payloadData - Us event se juda data
 */
export function broadcastPayAndRefundEvent(actionName, payloadData = {}) {
  eventBus.emit('GLOBAL_BROADCAST', {
    sourceModule: 'pay-and-refund',
    actionName: actionName,
    payload: payloadData
  });
}
