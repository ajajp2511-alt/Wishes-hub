/**
 * Sender Module - SEO & Traffic Growth Studio
 * Path: admin/features/seo/connection/seo-sender.js
 */

import { eventBus } from '../../eventbus.js';

/**
 * SEO module se kisi bhi event ko poore system me broadcast karne ke liye
 * @param {string} actionName - Event ka naam (e.g., 'GENERATE_SITEMAP', 'RUN_SEO_AUDIT')
 * @param {Object} payloadData - Us event se juda data
 */
export function broadcastSeoEvent(actionName, payloadData = {}) {
  eventBus.emit('GLOBAL_BROADCAST', {
    sourceModule: 'seo',
    actionName: actionName,
    payload: payloadData
  });
}
