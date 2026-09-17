/**
 * User Permissions - Wake Lock Sub-Module
 * Prevents screen from dimming during interactive wishes/animations.
 */

import { userPermissionsCore } from '../user-permissions-core.js';

export class UserPermissionsWakeLock {
    constructor() {
        this.wakeLock = null;
    }

    async requestLock() {
        const result = await userPermissionsCore.requestWakeLock();
        if (result.success) {
            this.wakeLock = result.lock;
            
            // Re-acquire lock if visibility changes (e.g., tab switching)
            document.addEventListener('visibilitychange', async () => {
                if (this.wakeLock !== null && document.visibilityState === 'visible') {
                    await userPermissionsCore.requestWakeLock();
                }
            });
        }
        return result;
    }

    async releaseLock() {
        if (this.wakeLock !== null) {
            await this.wakeLock.release();
            this.wakeLock = null;
        }
    }
  }
