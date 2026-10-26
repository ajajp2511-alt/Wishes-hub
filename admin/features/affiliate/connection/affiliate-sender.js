/**
 * Sender Module - Affiliate Engine
 * Path: admin/features/affiliate/connection/affiliate-sender.js
 */

import { eventBus } from '../../eventbus.js';

/**
 * Affiliate module se kisi bhi event ko poore system me broadcast karne ke liye
 * @param {string} actionName - Event ka naam (e.g., 'TRACK_CLICK', 'UPDATE_COMMISSION')
 * @param {Object} payloadData - Us event se juda data
 */
export function broadcastAffiliateEvent(actionName, payloadData = {}) {
  eventBus.emit('GLOBAL_BROADCAST', {
    sourceModule: 'affiliate',
    actionName: actionName,
    payload: payloadData
  });
}
