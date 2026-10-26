/**
 * Sender Module - Categories Management
 * Path: admin/features/categories/connection/categories-sender.js
 */

import { eventBus } from '../../eventbus.js';

/**
 * Categories module se kisi bhi event ko poore system me broadcast karne ke liye
 * @param {string} actionName - Event ka naam (e.g., 'ADD_CATEGORY', 'DELETE_CATEGORY')
 * @param {Object} payloadData - Us event se juda data
 */
export function broadcastCategoriesEvent(actionName, payloadData = {}) {
  eventBus.emit('GLOBAL_BROADCAST', {
    sourceModule: 'categories',
    actionName: actionName,
    payload: payloadData
  });
}
