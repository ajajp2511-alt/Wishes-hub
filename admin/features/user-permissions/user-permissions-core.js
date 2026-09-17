/**
 * User Permissions - Core Logic
 * Handles browser API integrations, state persistence, and permission wrappers.
 */

import { DEFAULT_CONFIG, PERMISSION_TYPES } from './user-permissions-config.js';

class UserPermissionsCore {
    constructor() {
        this.config = DEFAULT_CONFIG;
        this.state = this.loadState();
    }

    loadState() {
        try {
            const saved = localStorage.getItem(this.config.storageKey);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.error('Failed to load user permissions state', e);
        }

        // Default initial states
        return {
            grants: {},
            lastUpdated: new Date().toISOString(),
            auditLog: []
        };
    }

    saveState() {
        try {
            this.state.lastUpdated = new Date().toISOString();
            localStorage.setItem(this.config.storageKey, JSON.stringify(this.state));
            return true;
        } catch (e) {
            console.error('Failed to save user permissions state', e);
            return false;
        }
    }

    setPermissionState(type, status) {
        this.state.grants[type] = {
            status, // 'granted', 'denied', 'prompt'
            timestamp: Date.now()
        };
        this.saveState();
    }

    getPermissionState(type) {
        return this.state.grants[type]?.status || 'prompt';
    }

    async requestNotification() {
        if (!('Notification' in window)) return 'unsupported';
        const result = await Notification.requestPermission();
        this.setPermissionState(PERMISSION_TYPES.NOTIFICATIONS, result);
        return result;
    }

    async requestWakeLock() {
        if (!('wakeLock' in navigator)) return 'unsupported';
        try {
            const lock = await navigator.wakeLock.request('screen');
            this.setPermissionState(PERMISSION_TYPES.WAKELOCK, 'granted');
            return { success: true, lock };
        } catch (err) {
            this.setPermissionState(PERMISSION_TYPES.WAKELOCK, 'denied');
            return { success: false, error: err.message };
        }
    }
}

export const userPermissionsCore = new UserPermissionsCore();
