/**
 * Sender Module - Support Tickets & Live Chat Manager
 * Path: admin/features/support/connection/support-sender.js
 */

import { eventBus } from '../../eventbus.js';

/**
 * Support module se kisi bhi event ko poore system me broadcast karne ke liye
 * @param {string} actionName - Event ka naam (e.g., 'INIT', 'SELECT_TICKET', 'UPDATE_STATUS')
 * @param {Object} payloadData - Us event se juda data
 */
export function broadcastSupportEvent(actionName, payloadData = {}) {
  eventBus.emit('GLOBAL_BROADCAST', {
    sourceModule: 'support',
    actionName: actionName,
    payload: payloadData
  });
}
