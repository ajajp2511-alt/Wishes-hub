/**
 * Sender Module - Price & Plans Monetization Studio
 * Path: admin/features/price-plans/connection/price-plans-sender.js
 */

import { eventBus } from '../../eventbus.js';

/**
 * Price & Plans module se kisi bhi event ko poore system me broadcast karne ke liye
 * @param {string} actionName - Event ka naam (e.g., 'UPDATE_PRICING', 'APPLY_PROMO')
 * @param {Object} payloadData - Us event se juda data
 */
export function broadcastPricePlansEvent(actionName, payloadData = {}) {
  eventBus.emit('GLOBAL_BROADCAST', {
    sourceModule: 'price-plans',
    actionName: actionName,
    payload: payloadData
  });
}
