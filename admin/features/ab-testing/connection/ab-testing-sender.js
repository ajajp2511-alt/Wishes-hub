/**
 * Sender Module - A/B Testing Studio
 * Path: admin/features/ab-testing/connection/ab-testing-sender.js
 */

import { eventBus } from '../../eventbus.js';

/**
 * A/B Testing module se kisi bhi event ko poore system me broadcast karne ke liye
 * @param {string} actionName - Event ka naam (e.g., 'TRIGGER_VARIANT', 'UPDATE_METRICS')
 * @param {Object} payloadData - Us event se juda data
 */
export function broadcastAbTestingEvent(actionName, payloadData = {}) {
  eventBus.emit('GLOBAL_BROADCAST', {
    sourceModule: 'ab-testing',
    actionName: actionName,
    payload: payloadData
  });
}
