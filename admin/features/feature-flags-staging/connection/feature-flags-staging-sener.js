/**
 * Sender Module - Feature Flags & Staging
 * Path: admin/features/feature-flags-staging/connection/feature-flags-staging-sender.js
 */

import { eventBus } from '../../eventbus.js';

/**
 * Feature Flags & Staging module se kisi bhi event ko poore system me broadcast karne ke liye
 * @param {string} actionName - Event ka naam (e.g., 'TOGGLE_FLAG', 'EXECUTE_ROLLBACK')
 * @param {Object} payloadData - Us event se juda data
 */
export function broadcastFeatureFlagsStagingEvent(actionName, payloadData = {}) {
  eventBus.emit('GLOBAL_BROADCAST', {
    sourceModule: 'feature-flags-staging',
    actionName: actionName,
    payload: payloadData
  });
}
