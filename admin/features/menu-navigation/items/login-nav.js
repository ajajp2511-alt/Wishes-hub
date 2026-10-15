/**
 * Admin Login Navigation Item
 * Path: admin/features/menu-navigation/items/login-nav.js
 */

export const loginNavItem = {
  id: 'login-module',
  label: 'Login & Authentication',
  icon: '🔑',
  subItems: [
    { id: 'login-dashboard', label: 'Login Dashboard' },
    { id: 'login-endpoints', label: 'API & Endpoints' },
    { id: 'login-security', label: 'Security & Rate Limits' },
    { id: 'login-features', label: 'Feature Toggles' },
    { id: 'login-roles', label: 'Roles & Redirection' }
  ]
};
