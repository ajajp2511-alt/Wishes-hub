/**
 * Sender Module - Automation Studio
 * Path: admin/features/automation/connection/automation-sender.js
 */

import { eventBus } from '../../eventbus.js';

/**
 * Automation module se kisi bhi event ko poore system me broadcast karne ke liye
 * @param {string} actionName - Event ka naam (e.g., 'BOOT_AUTOMATION', 'EXECUTE_CAMPAIGN')
 * @param {Object} payloadData - Us event se juda data
 */
export function broadcastAutomationEvent(actionName, payloadData = {}) {
  eventBus.emit('GLOBAL_BROADCAST', {
    sourceModule: 'automation',
    actionName: actionName,
    payload: payloadData
  });
}
