/**
 * Sender Module - Manage Permissions & Access Control
 * Path: admin/features/manage-permissions/connection/manage-permissions-sender.js
 */

import { eventBus } from '../../eventbus.js';

/**
 * Manage Permissions module se kisi bhi event ko poore system me broadcast karne ke liye
 * @param {string} actionName - Event ka naam (e.g., 'INIT', 'LOAD_TAB_CONTENT')
 * @param {Object} payloadData - Us event se juda data
 */
export function broadcastManagePermissionsEvent(actionName, payloadData = {}) {
  eventBus.emit('GLOBAL_BROADCAST', {
    sourceModule: 'manage-permissions',
    actionName: actionName,
    payload: payloadData
  });
}
