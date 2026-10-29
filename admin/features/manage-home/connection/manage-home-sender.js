/**
 * Sender Module - Manage Home Dashboard
 * Path: admin/features/manage-home/connection/manage-home-sender.js
 */

import { eventBus } from '../../eventbus.js';

/**
 * Manage Home module se kisi bhi event ko poore system me broadcast karne ke liye
 * @param {string} actionName - Event ka naam (e.g., 'ASSEMBLE_HOME', 'FETCH_STATS')
 * @param {Object} payloadData - Us event se juda data
 */
export function broadcastManageHomeEvent(actionName, payloadData = {}) {
  eventBus.emit('GLOBAL_BROADCAST', {
    sourceModule: 'manage-home',
    actionName: actionName,
    payload: payloadData
  });
}
