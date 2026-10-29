/**
 * Sender Module - Menu & Navigation Controller
 * Path: admin/features/menu/connection/menu-sender.js
 */

import { eventBus } from '../../eventbus.js';

/**
 * Menu module se kisi bhi event ko poore system me broadcast karne ke liye
 * @param {string} actionName - Event ka naam (e.g., 'INIT_MENU', 'SET_ACTIVE_SUB_ITEM')
 * @param {Object} payloadData - Us event se juda data
 */
export function broadcastMenuEvent(actionName, payloadData = {}) {
  eventBus.emit('GLOBAL_BROADCAST', {
    sourceModule: 'menu',
    actionName: actionName,
    payload: payloadData
  });
}
