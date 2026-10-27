/**
 * Sender Module - Geo-Fencing & Cyber Fortress
 * Path: admin/features/geo-fencing-manager/connection/geo-fencing-manager-sender.js
 */

import { eventBus } from '../../eventbus.js';

/**
 * Geo Fencing Manager module se kisi bhi event ko poore system me broadcast karne ke liye
 * @param {string} actionName - Event ka naam (e.g., 'TOGGLE_COUNTRY', 'TOGGLE_KILL_SWITCH')
 * @param {Object} payloadData - Us event se juda data
 */
export function broadcastGeoFencingManagerEvent(actionName, payloadData = {}) {
  eventBus.emit('GLOBAL_BROADCAST', {
    sourceModule: 'geo-fencing-manager',
    actionName: actionName,
    payload: payloadData
  });
}
