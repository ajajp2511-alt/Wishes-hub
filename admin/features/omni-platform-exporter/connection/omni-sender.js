/**
 * Sender Module - Omni Platform Builds & Exporter
 * Path: admin/features/omni/connection/omni-sender.js
 */

import { eventBus } from '../../eventbus.js';

/**
 * Omni module se kisi bhi event ko poore system me broadcast karne ke liye
 * @param {string} actionName - Event ka naam (e.g., 'TRIGGER_CLOUD_BUILD', 'INIT')
 * @param {Object} payloadData - Us event se juda data
 */
export function broadcastOmniEvent(actionName, payloadData = {}) {
  eventBus.emit('GLOBAL_BROADCAST', {
    sourceModule: 'omni',
    actionName: actionName,
    payload: payloadData
  });
}
