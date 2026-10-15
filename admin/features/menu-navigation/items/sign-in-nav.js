/**
 * Admin Sign-In Navigation Item
 * Path: admin/features/menu-navigation/items/sign-in-nav.js
 */

export const signInNavItem = {
  id: 'sign-in-module',
  label: 'Sign-In Management',
  icon: '🔐',
  subItems: [
    { id: 'sign-in-dashboard', label: 'Dashboard & Overview' },
    { id: 'sign-in-requests', label: 'Access Requests' },
    { id: 'sign-in-security', label: 'Security & Lockouts' },
    { id: 'sign-in-socials', label: 'Social & Profile Links' },
    { id: 'sign-in-settings', label: 'Configuration & Rules' }
  ]
};
