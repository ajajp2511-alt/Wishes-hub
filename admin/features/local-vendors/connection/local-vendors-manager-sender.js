/**
 * Sender Module - Local Vendor Engine
 * Path: admin/features/local-vendors-manager/connection/local-vendors-manager-sender.js
 */

import { eventBus } from '../../eventbus.js';

/**
 * Local Vendors Manager module se kisi bhi event ko poore system me broadcast karne ke liye
 * @param {string} actionName - Event ka naam (e.g., 'REGISTER_MODULE', 'INIT')
 * @param {Object} payloadData - Us event se juda data
 */
export function broadcastLocalVendorsManagerEvent(actionName, payloadData = {}) {
  eventBus.emit('GLOBAL_BROADCAST', {
    sourceModule: 'local-vendors-manager',
    actionName: actionName,
    payload: payloadData
  });
}
