/**
 * Configuration & Constants for Central Approval & Problem Management Module
 * File: admin/features/approvals/approvals-config.js
 */

export const APPROVAL_CONFIG = {
    MODULE_NAME: 'Approval & Problem Management',
    VERSION: '1.0.0',
    
    // User Roles Hierarchy
    ROLES: {
        SUPER_ADMIN: 'SUPER_ADMIN',
        SUB_ADMIN: 'SUB_ADMIN',
        DESIGN_LEAD: 'DESIGN_LEAD',
        SUPPORT_LEAD: 'SUPPORT_LEAD'
    },

    // Approval Scopes
    SCOPES: {
        ADMIN: 'ADMIN_SCOPE',       // System access, roles, sign-ins
        CUSTOM: 'CUSTOM_SCOPE',     // 3D/2D templates, heavy designs
        USER: 'USER_SCOPE'          // Complaints, content reports, user badges
    },

    // Severity & Priority Levels
    PRIORITIES: {
        P0_CRITICAL: {
            id: 'P0',
            label: 'Critical Risk',
            requiresSuperAdmin: true,
            slaHours: 12
        },
        P1_HIGH: {
            id: 'P1',
            label: 'High Priority',
            requiresSuperAdmin: true,
            slaHours: 24
        },
        P2_NORMAL: {
            id: 'P2',
            label: 'Normal Priority',
            requiresSuperAdmin: false,
            slaHours: 48
        }
    },

    // Request Categories & Routing Rules
    CATEGORIES: {
        // Admin Scope
        ADMIN_SIGN_IN: {
            id: 'ADMIN_SIGN_IN',
            scope: 'ADMIN_SCOPE',
            label: 'Admin Sign-In Request',
            minRoleRequired: 'SUPER_ADMIN',
            priority: 'P0'
        },
        ROLE_CHANGE: {
            id: 'ROLE_CHANGE',
            scope: 'ADMIN_SCOPE',
            label: 'Role & Permission Escalation',
            minRoleRequired: 'SUPER_ADMIN',
            priority: 'P0'
        },

        // Custom / Heavy Design Scope
        HEAVY_DESIGN_TEMPLATE: {
            id: 'HEAVY_DESIGN_TEMPLATE',
            scope: 'CUSTOM_SCOPE',
            label: 'Heavy Design / 3D Wish Template',
            minRoleRequired: 'SUPER_ADMIN',
            priority: 'P1',
            maxAssetSizeMB: 5.0 // Asset threshold for mobile performance check
        },
        LAYOUT_UPDATE: {
            id: 'LAYOUT_UPDATE',
            scope: 'CUSTOM_SCOPE',
            label: 'Custom Wish Layout Change',
            minRoleRequired: 'DESIGN_LEAD',
            priority: 'P2',
            maxAssetSizeMB: 2.5
        },

        // User Scope
        USER_CONTENT_REPORT: {
            id: 'USER_CONTENT_REPORT',
            scope: 'USER_SCOPE',
            label: 'Reported Wish / Abusive Content',
            minRoleRequired: 'SUB_ADMIN',
            priority: 'P0'
        },
        USER_SUPPORT_TICKET: {
            id: 'USER_SUPPORT_TICKET',
            scope: 'USER_SCOPE',
            label: 'User Problem / Complaint',
            minRoleRequired: 'SUB_ADMIN',
            priority: 'P2'
        },
        USER_VERIFICATION_BADGE: {
            id: 'USER_VERIFICATION_BADGE',
            scope: 'USER_SCOPE',
            label: 'User Badge / Verification Request',
            minRoleRequired: 'SUB_ADMIN',
            priority: 'P2'
        }
    },

    // Status Workflow States
    STATUS: {
        PENDING: 'PENDING',
        UNDER_REVIEW: 'UNDER_REVIEW',
        REVISION_REQUESTED: 'REVISION_REQUESTED',
        APPROVED: 'APPROVED',
        REJECTED: 'REJECTED',
        SUSPENDED: 'SUSPENDED'
    },

    // UI Filter & Display Badges
    BADGES: {
        ADMIN_SCOPE: { bg: '#dc2626', text: '#ffffff', label: 'Admin Access' },
        CUSTOM_SCOPE: { bg: '#2563eb', text: '#ffffff', label: 'Heavy Design' },
        USER_SCOPE: { bg: '#059669', text: '#ffffff', label: 'User Problem' }
    },

    STORAGE_KEYS: {
        QUEUE: 'wishes_hub_approval_queue',
        AUDIT_LOG: 'wishes_hub_approval_audit_log'
    }
};
