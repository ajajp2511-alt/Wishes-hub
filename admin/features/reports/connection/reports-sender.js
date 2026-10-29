/**
 * Sender Module - Reports & Data Export Studio
 * Path: admin/features/reports/connection/reports-sender.js
 */

import { eventBus } from '../../eventbus.js';

/**
 * Reports module se kisi bhi event ko poore system me broadcast karne ke liye
 * @param {string} actionName - Event ka naam (e.g., 'GENERATE_REPORT', 'EXPORT_CSV')
 * @param {Object} payloadData - Us event se juda data
 */
export function broadcastReportsEvent(actionName, payloadData = {}) {
  eventBus.emit('GLOBAL_BROADCAST', {
    sourceModule: 'reports',
    actionName: actionName,
    payload: payloadData
  });
}
