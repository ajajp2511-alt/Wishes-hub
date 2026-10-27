/**
 * Sender Module - Localization & Languages Studio
 * Path: admin/features/localization/connection/localization-sender.js
 */

import { eventBus } from '../../eventbus.js';

/**
 * Localization module se kisi bhi event ko poore system me broadcast karne ke liye
 * @param {string} actionName - Event ka naam (e.g., 'UPDATE_TRANSLATION', 'SWITCH_LOCALE')
 * @param {Object} payloadData - Us event se juda data
 */
export function broadcastLocalizationEvent(actionName, payloadData = {}) {
  eventBus.emit('GLOBAL_BROADCAST', {
    sourceModule: 'localization',
    actionName: actionName,
    payload: payloadData
  });
}
