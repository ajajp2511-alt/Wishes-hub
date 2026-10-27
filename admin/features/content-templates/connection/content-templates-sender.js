/**
 * Sender Module - Content Engine & Templates Studio
 * Path: admin/features/content-templates/connection/content-templates-sender.js
 */

import { eventBus } from '../../eventbus.js';

/**
 * Content Templates module se kisi bhi event ko poore system me broadcast karne ke liye
 * @param {string} actionName - Event ka naam (e.g., 'RENDER_CANVAS', 'OPTIMIZE_EXPORT')
 * @param {Object} payloadData - Us event se juda data
 */
export function broadcastContentTemplatesEvent(actionName, payloadData = {}) {
  eventBus.emit('GLOBAL_BROADCAST', {
    sourceModule: 'content-templates',
    actionName: actionName,
    payload: payloadData
  });
}
