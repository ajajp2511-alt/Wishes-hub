/**
 * User Permissions - Wake Lock Sub-Module (Enhanced)
 * Prevents screen from dimming during interactive wishes/animations.
 */

import { userPermissionsCore } from '../user-permissions-core.js';

export class UserPermissionsWakeLock {
    constructor() {
        this.wakeLock = null;
        this._visibilityListener = null;
    }

    async requestLock() {
        const result = await userPermissionsCore.requestWakeLock();
        if (result.success) {
            this.wakeLock = result.lock;
            
            // Remove existing listener to prevent duplicate binding
            if (this._visibilityListener) {
                document.removeEventListener('visibilitychange', this._visibilityListener);
            }

            // Re-acquire lock if visibility changes (e.g., tab switching)
            this._visibilityListener = async () => {
                if (document.visibilityState === 'visible' && this.wakeLock !== null) {
                    const reacquireResult = await userPermissionsCore.requestWakeLock();
                    if (reacquireResult.success) {
                        this.wakeLock = reacquireResult.lock;
                    }
                }
            };

            document.addEventListener('visibilitychange', this._visibilityListener);
        }
        return result;
    }

    async releaseLock() {
        if (this.wakeLock !== null) {
            try {
                await this.wakeLock.release();
            } catch (err) {
                console.error('[WakeLock] Release error:', err);
            } finally {
                this.wakeLock = null;
                if (this._visibilityListener) {
                    document.removeEventListener('visibilitychange', this._visibilityListener);
                    this._visibilityListener = null;
                }
            }
        }
    }
}
