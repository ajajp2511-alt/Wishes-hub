/**
 * Sender Module - Global Language & Localization
 * Path: admin/features/global-language/connection/global-language-sender.js
 */

import { eventBus } from '../../eventbus.js';

/**
 * Global Language module se kisi bhi event ko poore system me broadcast karne ke liye
 * @param {string} actionName - Event ka naam (e.g., 'ADD_LANGUAGE', 'SWITCH_LANG')
 * @param {Object} payloadData - Us event se juda data
 */
export function broadcastGlobalLanguageEvent(actionName, payloadData = {}) {
  eventBus.emit('GLOBAL_BROADCAST', {
    sourceModule: 'global-language',
    actionName: actionName,
    payload: payloadData
  });
}
