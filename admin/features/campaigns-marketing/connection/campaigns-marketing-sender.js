/**
 * Sender Module - Campaigns & Marketing
 * Path: admin/features/campaigns-marketing/connection/campaigns-marketing-sender.js
 */

import { eventBus } from '../../eventbus.js';

/**
 * Campaigns & Marketing module se kisi bhi event ko poore system me broadcast karne ke liye
 * @param {string} actionName - Event ka naam (e.g., 'SCHEDULE_CAMPAIGN', 'BROADCAST_BOT')
 * @param {Object} payloadData - Us event se juda data
 */
export function broadcastCampaignsMarketingEvent(actionName, payloadData = {}) {
  eventBus.emit('GLOBAL_BROADCAST', {
    sourceModule: 'campaigns-marketing',
    actionName: actionName,
    payload: payloadData
  });
}
