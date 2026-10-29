/**
 * Sender Module - Security & Threat Shield
 * Path: admin/features/security-shield/connection/security-shield-sender.js
 */

import { eventBus } from '../../eventbus.js';

/**
 * Security Shield module se kisi bhi event ko poore system me broadcast karne ke liye
 * @param {string} actionName - Event ka naam (e.g., 'TRIGGER_LOCKDOWN', 'TOGGLE_IP_BLOCK')
 * @param {Object} payloadData - Us event se juda data
 */
export function broadcastSecurityShieldEvent(actionName, payloadData = {}) {
  eventBus.emit('GLOBAL_BROADCAST', {
    sourceModule: 'security-shield',
    actionName: actionName,
    payload: payloadData
  });
}
