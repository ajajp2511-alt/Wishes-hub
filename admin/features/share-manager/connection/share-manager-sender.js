/**
 * Sender Module - Share Manager & Viral Distribution Studio
 * Path: admin/features/share-manager/connection/share-manager-sender.js
 */

import { eventBus } from '../../eventbus.js';

/**
 * Share Manager module se kisi bhi event ko poore system me broadcast karne ke liye
 * @param {string} actionName - Event ka naam (e.g., 'TRIGGER_WHATSAPP_SHARE', 'TRACK_VIRALITY')
 * @param {Object} payloadData - Us event se juda data
 */
export function broadcastShareManagerEvent(actionName, payloadData = {}) {
  eventBus.emit('GLOBAL_BROADCAST', {
    sourceModule: 'share-manager',
    actionName: actionName,
    payload: payloadData
  });
}
