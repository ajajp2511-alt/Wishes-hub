/**
 * Sender Module - Media Manager & Telegram Storage
 * Path: admin/features/media-manager/connection/media-manager-sender.js
 */

import { eventBus } from '../../eventbus.js';

/**
 * Media Manager module se kisi bhi event ko poore system me broadcast karne ke liye
 * @param {string} actionName - Event ka naam (e.g., 'UPLOAD_MEDIA', 'SYNC_TELEGRAM_STORAGE')
 * @param {Object} payloadData - Us event se juda data
 */
export function broadcastMediaManagerEvent(actionName, payloadData = {}) {
  eventBus.emit('GLOBAL_BROADCAST', {
    sourceModule: 'media-manager',
    actionName: actionName,
    payload: payloadData
  });
}
