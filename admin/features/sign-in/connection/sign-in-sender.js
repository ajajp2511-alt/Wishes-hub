/**
 * Sender Module - Admin Sign-In & Authentication
 * Path: admin/features/sign-in/connection/sign-in-sender.js
 */

import { eventBus } from '../../eventbus.js';

/**
 * Sign-In module se kisi bhi event ko poore system me broadcast karne ke liye
 * @param {string} actionName - Event ka naam (e.g., 'INIT', 'SIGN_IN_ATTEMPT', 'COMPLETE_MFA')
 * @param {Object} payloadData - Us event se juda data
 */
export function broadcastSignInEvent(actionName, payloadData = {}) {
  eventBus.emit('GLOBAL_BROADCAST', {
    sourceModule: 'sign-in',
    actionName: actionName,
    payload: payloadData
  });
}
