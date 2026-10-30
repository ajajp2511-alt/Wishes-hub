/**
 * Sender Module - Worker Analytics Studio
 * Path: admin/features/worker-analytics/connection/worker-analytics-sender.js
 */

import { eventBus } from '../../eventbus.js';

/**
 * Worker Analytics module se kisi bhi event ko poore system me broadcast karne ke liye
 * @param {string} actionName - Event ka naam (e.g., 'INIT', 'FETCH_WORKER_STATUS', 'CHECK_CACHE')
 * @param {Object} payloadData - Us event se juda data
 */
export function broadcastWorkerAnalyticsEvent(actionName, payloadData = {}) {
  eventBus.emit('GLOBAL_BROADCAST', {
    sourceModule: 'worker-analytics',
    actionName: actionName,
    payload: payloadData
  });
}
