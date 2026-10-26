/**
 * Sender Module - AI & Automation Studio
 * Path: admin/features/ai-automation/connection/ai-automation-sender.js
 */

import { eventBus } from '../../eventbus.js';

/**
 * AI & Automation module se kisi bhi event ko poore system me broadcast karne ke liye
 * @param {string} actionName - Event ka naam (e.g., 'GENERATE_WISH', 'TRANSLATE_TEXT')
 * @param {Object} payloadData - Us event se juda data
 */
export function broadcastAiAutomationEvent(actionName, payloadData = {}) {
  eventBus.emit('GLOBAL_BROADCAST', {
    sourceModule: 'ai-automation',
    actionName: actionName,
    payload: payloadData
  });
}
