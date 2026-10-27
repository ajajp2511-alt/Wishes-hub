/**
 * Sender Module - Login Core & Authentication
 * Path: admin/features/login/connection/login-sender.js
 */

import { eventBus } from '../../eventbus.js';

/**
 * Login module se kisi bhi event ko poore system me broadcast karne ke liye
 * @param {string} actionName - Event ka naam (e.g., 'AUTHENTICATE_USER', 'LOGIN_SUCCESS')
 * @param {Object} payloadData - Us event se juda data
 */
export function broadcastLoginEvent(actionName, payloadData = {}) {
  eventBus.emit('GLOBAL_BROADCAST', {
    sourceModule: 'login',
    actionName: actionName,
    payload: payloadData
  });
}
