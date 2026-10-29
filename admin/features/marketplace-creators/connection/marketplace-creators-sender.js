/**
 * Sender Module - Marketplace & Creators Hub
 * Path: admin/features/marketplace-creators/connection/marketplace-creators-sender.js
 */

import { eventBus } from '../../eventbus.js';

/**
 * Marketplace & Creators module se kisi bhi event ko poore system me broadcast karne ke liye
 * @param {string} actionName - Event ka naam (e.g., 'APPROVE_SUBMISSION', 'PROCESS_PAYOUT')
 * @param {Object} payloadData - Us event se juda data
 */
export function broadcastMarketplaceCreatorsEvent(actionName, payloadData = {}) {
  eventBus.emit('GLOBAL_BROADCAST', {
    sourceModule: 'marketplace-creators',
    actionName: actionName,
    payload: payloadData
  });
}
