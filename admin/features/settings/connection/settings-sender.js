/**
 * Sender Module - Global Platform Settings
 * Path: admin/features/settings/connection/settings-sender.js
 */

import { eventBus } from '../../eventbus.js';

/**
 * Settings module se kisi bhi event ko poore system me broadcast karne ke liye
 * @param {string} actionName - Event ka naam (e.g., 'UPDATE_SETTINGS', 'SAVE_SEO_META')
 * @param {Object} payloadData - Us event se juda data
 */
export function broadcastSettingsEvent(actionName, payloadData = {}) {
  eventBus.emit('GLOBAL_BROADCAST', {
    sourceModule: 'settings',
    actionName: actionName,
    payload: payloadData
  });
}
