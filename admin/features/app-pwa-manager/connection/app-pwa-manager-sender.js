/**
 * Sender Module - App & PWA Manager
 * Path: admin/features/app-pwa-manager/connection/app-pwa-manager-sender.js
 */

import { eventBus } from '../../eventbus.js';

/**
 * App & PWA Manager module se kisi bhi event ko poore system me broadcast karne ke liye
 * @param {string} actionName - Event ka naam (e.g., 'TRIGGER_INSTALL', 'PURGE_CACHE')
 * @param {Object} payloadData - Us event se juda data
 */
export function broadcastAppPwaManagerEvent(actionName, payloadData = {}) {
  eventBus.emit('GLOBAL_BROADCAST', {
    sourceModule: 'app-pwa-manager',
    actionName: actionName,
    payload: payloadData
  });
}
