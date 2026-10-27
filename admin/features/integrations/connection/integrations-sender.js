/**
 * Sender Module - Integrations & Webhooks Hub
 * Path: admin/features/integrations/connection/integrations-sender.js
 */

import { eventBus } from '../../eventbus.js';

/**
 * Integrations & Webhooks module se kisi bhi event ko poore system me broadcast karne ke liye
 * @param {string} actionName - Event ka naam (e.g., 'TRIGGER_WEBHOOK', 'TEST_API_GATEWAY')
 * @param {Object} payloadData - Us event se juda data
 */
export function broadcastIntegrationsEvent(actionName, payloadData = {}) {
  eventBus.emit('GLOBAL_BROADCAST', {
    sourceModule: 'integrations',
    actionName: actionName,
    payload: payloadData
  });
}
