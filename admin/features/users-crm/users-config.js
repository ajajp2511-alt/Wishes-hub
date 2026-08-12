/**
 * Users & CRM Module - Configuration & Schemas
 * Path: admin/features/users-crm/users-config.js
 */

export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  CREATOR_VIP: 'creator_vip',
  STANDARD_USER: 'standard_user'
};

export const USER_STATUSES = {
  ACTIVE: 'Active',
  SUSPENDED: 'Suspended',
  BANNED: 'Banned',
  PENDING_VERIFICATION: 'Pending'
};

export const CRM_SEGMENTS = {
  ALL: 'All Registered Users',
  POWER_CREATORS: 'Power Creators',
  DORMANT: 'Dormant Users',
  NEW_USERS: 'New Joiners',
  REPORTED: 'Flagged Accounts'
};

export const PRIVACY_CONFIG = {
  gdprExportFormat: 'json',
  anonymizeIp: true,
  dataRetentionDays: 365,
  enableAuditLogging: true
};

export const USERS_CONFIG = {
  itemsPerPage: 15,
  maxBulkSelection: 50,
  endpoints: {
    fetchUsers: '/api/users',
    updateStatus: '/api/users/status',
    exportPrivacyData: '/api/users/privacy/export',
    purgeUser: '/api/users/privacy/purge'
  }
};
