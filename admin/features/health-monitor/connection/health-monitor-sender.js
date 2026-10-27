/**
 * Sender Module - Health & System Monitor
 * Path: admin/features/health-monitor/connection/health-monitor-sender.js
 */

import { eventBus } from '../../eventbus.js';

/**
 * Health & System Monitor module se kisi bhi event ko poore system me broadcast karne ke liye
 * @param {string} actionName - Event ka naam (e.g., 'CHECK_SERVER_STATUS', 'TRIGGER_ALERT')
 * @param {Object} payloadData - Us event se juda data
 */
export function broadcastHealthMonitorEvent(actionName, payloadData = {}) {
  eventBus.emit('GLOBAL_BROADCAST', {
    sourceModule: 'health-monitor',
    actionName: actionName,
    payload: payloadData
  });
}
