/**
 * Sender Module - Digital Wallet & Financial Rewards
 * Path: admin/features/wallet/connection/wallet-sender.js
 */

import { eventBus } from '../../eventbus.js';

/**
 * Wallet module se kisi bhi event ko poore system me broadcast karne ke liye
 * @param {string} actionName - Event ka naam (e.g., 'INIT', 'WITHDRAWAL_REQUEST', 'MANUAL_ADJUSTMENT')
 * @param {Object} payloadData - Us event se juda data
 */
export function broadcastWalletEvent(actionName, payloadData = {}) {
  eventBus.emit('GLOBAL_BROADCAST', {
    sourceModule: 'wallet',
    actionName: actionName,
    payload: payloadData
  });
}
