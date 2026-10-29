/**
 * Sender Module - Notifications & Broadcaster Studio
 * Path: admin/features/notifications/connection/notifications-sender.js
 */

import { eventBus } from '../../eventbus.js';

/**
 * Notifications module se kisi bhi event ko poore system me broadcast karne ke liye
 * @param {string} actionName - Event ka naam (e.g., 'SEND_PUSH_ALERT', 'BROADCAST_FESTIVE')
 * @param {Object} payloadData - Us event se juda data
 */
export function broadcastNotificationsEvent(actionName, payloadData = {}) {
  eventBus.emit('GLOBAL_BROADCAST', {
    sourceModule: 'notifications',
    actionName: actionName,
    payload: payloadData
  });
}
