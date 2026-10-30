/**
 * Sender Module - Trending & Viral Engine Studio
 * Path: admin/features/trending/connection/trending-sender.js
 */

import { eventBus } from '../../eventbus.js';

/**
 * Trending module se kisi bhi event ko poore system me broadcast karne ke liye
 * @param {string} actionName - Event ka naam (e.g., 'INIT', 'UPDATE_HERO', 'REFRESH_TRENDS')
 * @param {Object} payloadData - Us event se juda data
 */
export function broadcastTrendingEvent(actionName, payloadData = {}) {
  eventBus.emit('GLOBAL_BROADCAST', {
    sourceModule: 'trending',
    actionName: actionName,
    payload: payloadData
  });
}
