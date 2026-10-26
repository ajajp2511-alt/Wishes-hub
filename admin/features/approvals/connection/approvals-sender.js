/**
 * Sender Module - Central Approval & Problem Management
 * Path: admin/features/approvals/connection/approvals-sender.js
 */

import { eventBus } from '../../eventbus.js';

/**
 * Approvals module se kisi bhi event ko poore system me broadcast karne ke liye
 * @param {string} actionName - Event ka naam (e.g., 'APPROVE_REQUEST', 'REJECT_REQUEST')
 * @param {Object} payloadData - Us event se juda data
 */
export function broadcastApprovalsEvent(actionName, payloadData = {}) {
  eventBus.emit('GLOBAL_BROADCAST', {
    sourceModule: 'approvals',
    actionName: actionName,
    payload: payloadData
  });
}
