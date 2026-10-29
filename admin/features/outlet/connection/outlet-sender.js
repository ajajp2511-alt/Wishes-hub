/**
 * Sender Module - Outlet Dynamic View Manager
 * Path: admin/features/outlet/connection/outlet-sender.js
 */

import { eventBus } from '../../eventbus.js';

/**
 * Outlet module se kisi bhi event ko poore system me broadcast karne ke liye
 * @param {string} actionName - Event ka naam (e.g., 'INIT_OUTLET', 'NAVIGATE_TO')
 * @param {Object} payloadData - Us event se juda data
 */
export function broadcastOutletEvent(actionName, payloadData = {}) {
  eventBus.emit('GLOBAL_BROADCAST', {
    sourceModule: 'outlet',
    actionName: actionName,
    payload: payloadData
  });
}
