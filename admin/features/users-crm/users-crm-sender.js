/**
 * Sender Module - Users & CRM Management Studio
 * Path: admin/features/users-crm/connection/users-crm-sender.js
 */

import { eventBus } from '../../eventbus.js';

/**
 * Users CRM module se kisi bhi event ko poore system me broadcast karne ke liye
 * @param {string} actionName - Event ka naam (e.g., 'INIT', 'FETCH_USERS', 'UPDATE_STATUS')
 * @param {Object} payloadData - Us event se juda data
 */
export function broadcastUsersCrmEvent(actionName, payloadData = {}) {
  eventBus.emit('GLOBAL_BROADCAST', {
    sourceModule: 'users-crm',
    actionName: actionName,
    payload: payloadData
  });
}
