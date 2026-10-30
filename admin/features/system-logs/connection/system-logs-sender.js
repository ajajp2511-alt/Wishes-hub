/**
 * Sender Module - System Logs & Observability Hub
 * Path: admin/features/system-logs/connection/system-logs-sender.js
 */

import { eventBus } from '../../eventbus.js';

/**
 * System Logs module se kisi bhi event ko poore system me broadcast karne ke liye
 * @param {string} actionName - Event ka naam (e.g., 'INIT', 'FETCH_AUDIT_LOGS', 'EXPORT_LOGS')
 * @param {Object} payloadData - Us event se juda data
 */
export function broadcastSystemLogsEvent(actionName, payloadData = {}) {
  eventBus.emit('GLOBAL_BROADCAST', {
    sourceModule: 'system-logs',
    actionName: actionName,
    payload: payloadData
  });
}
