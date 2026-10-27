/**
 * Sender Module - Google Sheets Integration Hub
 * Path: admin/features/google-sheets/connection/google-sheets-sender.js
 */

import { eventBus } from '../../eventbus.js';

/**
 * Google Sheets module se kisi bhi event ko poore system me broadcast karne ke liye
 * @param {string} actionName - Event ka naam (e.g., 'ADD_SHEET_ID', 'SYNC_DATA')
 * @param {Object} payloadData - Us event se juda data
 */
export function broadcastGoogleSheetsEvent(actionName, payloadData = {}) {
  eventBus.emit('GLOBAL_BROADCAST', {
    sourceModule: 'google-sheets',
    actionName: actionName,
    payload: payloadData
  });
}
