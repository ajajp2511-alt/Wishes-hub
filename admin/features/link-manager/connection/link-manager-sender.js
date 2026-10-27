/**
 * Sender Module - Link Manager & URL Routing Studio
 * Path: admin/features/link-manager/connection/link-manager-sender.js
 */

import { eventBus } from '../../eventbus.js';

/**
 * Link Manager module se kisi bhi event ko poore system me broadcast karne ke liye
 * @param {string} actionName - Event ka naam (e.g., 'CREATE_SHORT_LINK', 'UPDATE_REDIRECT_RULE')
 * @param {Object} payloadData - Us event se juda data
 */
export function broadcastLinkManagerEvent(actionName, payloadData = {}) {
  eventBus.emit('GLOBAL_BROADCAST', {
    sourceModule: 'link-manager',
    actionName: actionName,
    payload: payloadData
  });
}
