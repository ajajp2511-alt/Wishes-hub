/**
 * Sender Module - Assets & Inventory Hub
 * Path: admin/features/assets/connection/assets-sender.js
 */

import { eventBus } from '../../eventbus.js';

/**
 * Assets & Inventory module se kisi bhi event ko poore system me broadcast karne ke liye
 * @param {string} actionName - Event ka naam (e.g., 'UPLOAD_ASSET', 'SWITCH_CATEGORY')
 * @param {Object} payloadData - Us event se juda data
 */
export function broadcastAssetsEvent(actionName, payloadData = {}) {
  eventBus.emit('GLOBAL_BROADCAST', {
    sourceModule: 'assets',
    actionName: actionName,
    payload: payloadData
  });
}
