/**
 * Sender Module - Gamification & Rewards
 * Path: admin/features/gamification-rewards/connection/gamification-rewards-sender.js
 */

import { eventBus } from '../../eventbus.js';

/**
 * Gamification & Rewards module se kisi bhi event ko poore system me broadcast karne ke liye
 * @param {string} actionName - Event ka naam (e.g., 'CLAIM_STREAK', 'TOGGLE_BOOST')
 * @param {Object} payloadData - Us event se juda data
 */
export function broadcastGamificationRewardsEvent(actionName, payloadData = {}) {
  eventBus.emit('GLOBAL_BROADCAST', {
    sourceModule: 'gamification-rewards',
    actionName: actionName,
    payload: payloadData
  });
}
