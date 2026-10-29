/**
 * Sender Module - Manage Wish Feature
 * Path: admin/features/manage-wish/connection/manage-wish-sender.js
 */

import { eventBus } from '../../eventbus.js';

/**
 * Manage Wish module se kisi bhi event ko poore system me broadcast karne ke liye
 * @param {string} actionName - Event ka naam (e.g., 'INIT', 'REFRESH_DATA')
 * @param {Object} payloadData - Us event se juda data
 */
export function broadcastManageWishEvent(actionName, payloadData = {}) {
  eventBus.emit('GLOBAL_BROADCAST', {
    sourceModule: 'manage-wish',
    actionName: actionName,
    payload: payloadData
  });
}
