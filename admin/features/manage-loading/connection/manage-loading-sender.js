/**
 * Sender Module - Manage Loading Studio & Spinner Management
 * Path: admin/features/manage-loading/connection/manage-loading-sender.js
 */

import { eventBus } from '../../eventbus.js';

/**
 * Manage Loading module se kisi bhi event ko poore system me broadcast karne ke liye
 * @param {string} actionName - Event ka naam (e.g., 'INIT', 'ASSEMBLE_LOADING')
 * @param {Object} payloadData - Us event se juda data
 */
export function broadcastManageLoadingEvent(actionName, payloadData = {}) {
  eventBus.emit('GLOBAL_BROADCAST', {
    sourceModule: 'manage-loading',
    actionName: actionName,
    payload: payloadData
  });
}
