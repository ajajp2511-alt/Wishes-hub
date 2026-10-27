/**
 * Sender Module - Create Wish Feature
 * Path: admin/features/create-wish/connection/create-wish-sender.js
 */

import { eventBus } from '../../eventbus.js';

/**
 * Create Wish module se kisi bhi event ko poore system me broadcast karne ke liye
 * @param {string} actionName - Event ka naam (e.g., 'INIT', 'LOAD_MODULE', 'UPDATE_STATE')
 * @param {Object} payloadData - Us event se juda data
 */
export function broadcastCreateWishEvent(actionName, payloadData = {}) {
  eventBus.emit('GLOBAL_BROADCAST', {
    sourceModule: 'create-wish',
    actionName: actionName,
    payload: payloadData
  });
}
