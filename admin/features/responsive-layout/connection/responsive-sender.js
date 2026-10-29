/**
 * Sender Module - Responsive Header & Mobile Sidebar Manager
 * Path: admin/features/responsive/connection/responsive-sender.js
 */

import { eventBus } from '../../eventbus.js';

/**
 * Responsive module se kisi bhi event ko poore system me broadcast karne ke liye
 * @param {string} actionName - Event ka naam (e.g., 'INIT', 'TOGGLE_SIDEBAR', 'SYNC_UI')
 * @param {Object} payloadData - Us event se juda data
 */
export function broadcastResponsiveEvent(actionName, payloadData = {}) {
  eventBus.emit('GLOBAL_BROADCAST', {
    sourceModule: 'responsive',
    actionName: actionName,
    payload: payloadData
  });
}
