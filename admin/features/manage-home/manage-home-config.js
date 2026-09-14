/**
 * manage-home-config.js
 * Configuration settings for Wishes Hub Home Dashboard
 */
export const HomeConfig = {
  refreshInterval: 30000, // 30 seconds auto-polling
  defaultWidgetsOrder: ['stats', 'activity', 'actions', 'health', 'notes'],
  storageKeys: {
    widgetsOrder: 'wishes_home_widgets_order',
    scratchpad: 'wishes_admin_scratchpad'
  },
  apiEndpoints: {
    stats: '/api/admin/stats',
    activity: '/api/admin/activity',
    health: '/api/admin/health'
  }
};
