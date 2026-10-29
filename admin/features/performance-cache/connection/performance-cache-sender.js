/**
 * Sender Module - Performance & Cache Optimization Studio
 * Path: admin/features/performance-cache/connection/performance-cache-sender.js
 */

import { eventBus } from '../../eventbus.js';

/**
 * Performance & Cache module se kisi bhi event ko poore system me broadcast karne ke liye
 * @param {string} actionName - Event ka naam (e.g., 'PURGE_CDN', 'REFRESH_METRICS')
 * @param {Object} payloadData - Us event se juda data
 */
export function broadcastPerformanceCacheEvent(actionName, payloadData = {}) {
  eventBus.emit('GLOBAL_BROADCAST', {
    sourceModule: 'performance-cache',
    actionName: actionName,
    payload: payloadData
  });
}
