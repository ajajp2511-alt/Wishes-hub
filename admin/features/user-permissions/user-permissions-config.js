/**
 * User Permissions - Configuration & Constants
 * Defines default settings, permission keys, and error messages.
 */

export const PERMISSION_TYPES = {
    NOTIFICATIONS: 'notifications',
    LOCATION: 'location',
    COOKIES: 'cookies',
    CLIPBOARD: 'clipboard',
    MEDIA: 'media',
    MICROPHONE: 'microphone',
    MOTION: 'motion',
    BATTERY: 'battery',
    NETWORK: 'network',
    BIOMETRIC: 'biometric',
    WAKELOCK: 'wakelock',
    SHARE: 'share',
    HARDWARE: 'hardware'
};

export const DEFAULT_CONFIG = {
    storageKey: 'wishes_hub_user_permissions_v1',
    inactivityTimeoutMs: 15 * 60 * 1000, // 15 Minutes
    clipboardAutoCleanMs: 30 * 1000,     // 30 Seconds
    batterySaverThreshold: 0.20,         // 20% Battery
    enableAuditLogs: true
};

export const PERMISSION_MESSAGES = {
    denied: 'Permission was denied by the user or browser settings.',
    unsupported: 'This API/Permission is not supported on your current device or browser.',
    success: 'Permission granted successfully.'
};
