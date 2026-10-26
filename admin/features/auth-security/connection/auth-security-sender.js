/**
 * Sender Module - Auth & Security
 * Path: admin/features/auth-security/connection/auth-security-sender.js
 */

import { eventBus } from '../../eventbus.js';

/**
 * Auth Security module se kisi bhi event ko poore system me broadcast karne ke liye
 * @param {string} actionName - Event ka naam (e.g., 'CHECK_BRUTE_FORCE', 'ENFORCE_MFA')
 * @param {Object} payloadData - Us event se juda data
 */
export function broadcastAuthSecurityEvent(actionName, payloadData = {}) {
  eventBus.emit('GLOBAL_BROADCAST', {
    sourceModule: 'auth-security',
    actionName: actionName,
    payload: payloadData
  });
}
