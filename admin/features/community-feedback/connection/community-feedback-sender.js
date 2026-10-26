/**
 * Sender Module - Community & Feedback
 * Path: admin/features/community-feedback/connection/community-feedback-sender.js
 */

import { eventBus } from '../../eventbus.js';

/**
 * Community & Feedback module se kisi bhi event ko poore system me broadcast karne ke liye
 * @param {string} actionName - Event ka naam (e.g., 'SUBMIT_WISH_REQUEST', 'MODERATE_COMMENT')
 * @param {Object} payloadData - Us event se juda data
 */
export function broadcastCommunityFeedbackEvent(actionName, payloadData = {}) {
  eventBus.emit('GLOBAL_BROADCAST', {
    sourceModule: 'community-feedback',
    actionName: actionName,
    payload: payloadData
  });
}
