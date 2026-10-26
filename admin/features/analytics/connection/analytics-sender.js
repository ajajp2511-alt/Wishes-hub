/**
 * Sender Module - Analytics Intelligence Studio
 * Path: admin/features/analytics/connection/analytics-sender.js
 */

import { eventBus } from '../../eventbus.js';

/**
 * Analytics module se kisi bhi event ko poore system me broadcast karne ke liye
 * @param {string} actionName - Event ka naam (e.g., 'TRACK_TRAFFIC', 'LOG_METRIC')
 * @param {Object} payloadData - Us event se juda data
 */
export function broadcastAnalyticsEvent(actionName, payloadData = {}) {
  eventBus.emit('GLOBAL_BROADCAST', {
    sourceModule: 'analytics',
    actionName: actionName,
    payload: payloadData
  });
}
