/**
 * Manage Permissions - Configuration & Constants
 * Defines core roles, permission scopes, and default security thresholds.
 */

export const PERMISSION_CONFIG = {
    VERSION: '1.0.0',
    DEFAULT_ROLE: 'Content Editor',
    CACHE_EXPIRY_MS: 15 * 60 * 1000, // 15 Minutes
    MAX_FAILED_ATTEMPTS: 5,
    RISK_LEVELS: {
        LOW: 'LOW',
        MEDIUM: 'MEDIUM',
        HIGH: 'HIGH',
        CRITICAL: 'CRITICAL'
    }
};

export const SYSTEM_ROLES = {
    SUPER_ADMIN: {
        id: 'super_admin',
        name: 'Super Admin',
        description: 'Full unhindered access to all system features and configurations.'
    },
    REGIONAL_ADMIN: {
        id: 'regional_admin',
        name: 'Regional / Scoped Admin',
        description: 'Limited administrative control over specific categories or regions.'
    },
    CONTENT_EDITOR: {
        id: 'content_editor',
        name: 'Content Editor',
        description: 'Can create, update, and manage wishes and categories.'
    },
    SUPPORT_MODERATOR: {
        id: 'support_moderator',
        name: 'Support Moderator',
        description: 'Can view audit trails, handle user requests, and oversee basic compliance.'
    }
};

export const PERMISSION_ACTIONS = {
    CREATE: 'create',
    READ: 'read',
    UPDATE: 'update',
    DELETE: 'delete',
    PUBLISH: 'publish',
    EXPORT: 'export',
    APPROVE: 'approve',
    BYPASS: 'bypass'
};
