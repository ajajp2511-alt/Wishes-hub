/**
 * Sender Module - Festival Storyteller
 * Path: admin/features/festival-storyteller/connection/festival-storyteller-sender.js
 */

import { eventBus } from '../../eventbus.js';

/**
 * Festival Storyteller module se kisi bhi event ko poore system me broadcast karne ke liye
 * @param {string} actionName - Event ka naam (e.g., 'BOOTSTRAP', 'RENDER_STORY')
 * @param {Object} payloadData - Us event se juda data
 */
export function broadcastFestivalStorytellerEvent(actionName, payloadData = {}) {
  eventBus.emit('GLOBAL_BROADCAST', {
    sourceModule: 'festival-storyteller',
    actionName: actionName,
    payload: payloadData
  });
}
