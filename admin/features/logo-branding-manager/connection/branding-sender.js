/**
 * Sender Module - Branding & Customization Studio
 * Path: admin/features/branding/connection/branding-sender.js
 */

import { eventBus } from '../../eventbus.js';

/**
 * Branding module se kisi bhi event ko poore system me broadcast karne ke liye
 * @param {string} actionName - Event ka naam (e.g., 'TOGGLE_PLACEMENT_VISIBILITY', 'INIT')
 * @param {Object} payloadData - Us event se juda data
 */
export function broadcastBrandingEvent(actionName, payloadData = {}) {
  eventBus.emit('GLOBAL_BROADCAST', {
    sourceModule: 'branding',
    actionName: actionName,
    payload: payloadData
  });
}
