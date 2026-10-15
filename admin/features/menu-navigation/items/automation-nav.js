/**
 * Automation Engine Navigation Item
 * Path: admin/features/menu-navigation/items/automation-nav.js
 */

export const automationNavItem = {
  id: 'automation-module',
  label: 'Automation Engine',
  icon: '⚡',
  subItems: [
    { id: 'automation-dashboard', label: 'Engine Overview & Status' },
    { id: 'automation-festival-db', label: 'Festival Master Database' },
    { id: 'automation-3d-monetization', label: '3D Pricing & Monetization' },
    { id: 'automation-sponsorship', label: 'Marketing Sponsorship' },
    { id: 'automation-content-guard', label: 'Content Guard Rules' }
  ]
};
