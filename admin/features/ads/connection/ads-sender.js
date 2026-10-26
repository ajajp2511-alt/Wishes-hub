/**
 * Sender Module - Master Ads
 * Path: admin/features/ads/connection/ads-sender.js
 */

import { eventBus } from '../../eventbus.js';

/**
 * Master Ads module se kisi bhi event ko poore system me broadcast karne ke liye
 * @param {string} actionName - Event ka naam (e.g., 'CREATE_AD', 'RUN_BILLING_CHECK')
 * @param {Object} payloadData - Us event se juda data
 */
export function broadcastAdsEvent(actionName, payloadData = {}) {
  eventBus.emit('GLOBAL_BROADCAST', {
    sourceModule: 'ads',
    actionName: actionName,
    payload: payloadData
  });
}
