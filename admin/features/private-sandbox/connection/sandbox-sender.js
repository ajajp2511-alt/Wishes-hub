/**
 * Sender Module - Sandbox & Feature Flags Staging
 * Path: admin/features/sandbox/connection/sandbox-sender.js
 */

import { eventBus } from '../../eventbus.js';

/**
 * Sandbox module se kisi bhi event ko poore system me broadcast karne ke liye
 * @param {string} actionName - Event ka naam (e.g., 'INIT', 'TRIGGER_ROLLBACK', 'TOGGLE_FLAG')
 * @param {Object} payloadData - Us event se juda data
 */
export function broadcastSandboxEvent(actionName, payloadData = {}) {
  eventBus.emit('GLOBAL_BROADCAST', {
    sourceModule: 'sandbox',
    actionName: actionName,
    payload: payloadData
  });
}
