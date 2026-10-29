/**
 * Sender Module - Monetization & Ads Management Studio
 * Path: admin/features/monetization/connection/monetization-sender.js
 */

import { eventBus } from '../../eventbus.js';

/**
 * Monetization module se kisi bhi event ko poore system me broadcast karne ke liye
 * @param {string} actionName - Event ka naam (e.g., 'RENDER_AD_PLACEMENT', 'UPDATE_REVENUE')
 * @param {Object} payloadData - Us event se juda data
 */
export function broadcastMonetizationEvent(actionName, payloadData = {}) {
  eventBus.emit('GLOBAL_BROADCAST', {
    sourceModule: 'monetization',
    actionName: actionName,
    payload: payloadData
  });
}
