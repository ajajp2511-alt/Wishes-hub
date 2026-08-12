/**
 * Manage Wish Feature - Configuration & Table Schemas
 * Path: admin/features/manage-wish/manage-wish-config.js
 */

export const MANAGE_WISH_CONFIG = {
  defaultPageSize: 10,
  maxBulkSelect: 50,
  quotaWarningThreshold: 80, // Percentage
};

export const WISH_STATUSES = {
  ACTIVE: 'Active',
  SCHEDULED: 'Scheduled',
  EXPIRED: 'Expired',
  ARCHIVED: 'Archived',
  SPAM: 'Spam'
};

// Unified Table Column Definitions
export const TABLE_COLUMNS = [
  { key: 'select', label: '', sortable: false },
  { key: 'Wish_ID', label: 'Wish ID', sortable: true },
  { key: 'Title', label: 'Title', sortable: true },
  { key: 'Category', label: 'Category', sortable: true },
  { key: 'Status', label: 'Status', sortable: true },
  { key: 'Created_At', label: 'Created Date', sortable: true },
  { key: 'Actions', label: 'Actions', sortable: false }
];

// Filter Configuration Options
export const FILTER_OPTIONS = {
  categories: ['All', 'text', 'image', 'audio', 'video', 'story', 'interactive', 'ai'],
  statuses: ['All', 'Active', 'Scheduled', 'Expired', 'Archived', 'Spam']
};
