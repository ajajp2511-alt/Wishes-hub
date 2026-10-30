/**
 * Sender Module - 3D Master Assembly & Orchestration
 * Path: admin/features/3d/connection/3d-sender.js
 */

import { eventBus } from '../../eventbus.js';

/**
 * 3D module se kisi bhi event ko poore system me broadcast karne ke liye
 * @param {string} actionName - Event ka naam (e.g., 'INIT_ALL_MODULES', 'GET_MODULE')
 * @param {Object} payloadData - Us event se juda data
 */
export function broadcast3dEvent(actionName, payloadData = {}) {
  eventBus.emit('GLOBAL_BROADCAST', {
    sourceModule: '3d',
    actionName: actionName,
    payload: payloadData
  });
}
