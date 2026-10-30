/**
 * Sender Module - Device & User Permissions Management
 * Path: admin/features/user-permissions/connection/user-permissions-sender.js
 */

import { eventBus } from '../../eventbus.js';

/**
 * User Permissions module se kisi bhi event ko poore system me broadcast karne ke liye
 * @param {string} actionName - Event ka naam (e.g., 'INIT', 'REQUEST_PERMISSION', 'EXPORT_PERMISSIONS')
 * @param {Object} payloadData - Us event se juda data
 */
export function broadcastUserPermissionsEvent(actionName, payloadData = {}) {
  eventBus.emit('GLOBAL_BROADCAST', {
    sourceModule: 'user-permissions',
    actionName: actionName,
    payload: payloadData
  });
}
