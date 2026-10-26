/**
 * Sender Module - Compliance & Legal Center
 * Path: admin/features/compliance/connection/compliance-sender.js
 */

import { eventBus } from '../../eventbus.js';

/**
 * Compliance & Legal module se kisi bhi event ko poore system me broadcast karne ke liye
 * @param {string} actionName - Event ka naam (e.g., 'PROCESS_GDPR_REQUEST', 'LOG_COMPLIANCE_AUDIT')
 * @param {Object} payloadData - Us event se juda data
 */
export function broadcastComplianceEvent(actionName, payloadData = {}) {
  eventBus.emit('GLOBAL_BROADCAST', {
    sourceModule: 'compliance',
    actionName: actionName,
    payload: payloadData
  });
}
