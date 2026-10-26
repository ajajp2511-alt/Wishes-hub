/**
 * Sender Module - 3D Engine
 * Path: wishes-hub/admin/features/3d/connection/3d-sender.js
 */

import { coreEngine } from '../3d-core.js'; // ya agar global eventbus use ho raha ho toh uske mutabiq

/**
 * 3D module se kisi bhi event ko poore system me broadcast karne ke liye
 * @param {string} actionName - Event ka naam (e.g., 'INIT_MODULES', 'RENDER_EFFECT')
 * @param {Object} payloadData - Us event se juda data
 */
export function broadcast3DEvent(actionName, payloadData = {}) {
  // Agar aap global eventBus use kar rahe hain toh eventBus.emit('GLOBAL_BROADCAST', ...) likh sakte hain
  if (typeof coreEngine.emit === 'function') {
    coreEngine.emit('GLOBAL_BROADCAST', {
      sourceModule: '3d',
      actionName: actionName,
      payload: payloadData
    });
  }
}
