/**
 * Ads Management Navigation Item
 * Path: admin/features/menu-navigation/items/ads-nav.js
 */

export const adsNavItem = {
  id: 'ads-module',
  label: 'Ads Management',
  icon: '📢',
  subItems: [
    { id: 'ads-dashboard', label: 'Dashboard & Active Ads' },
    { id: 'ads-zones', label: 'Placement Zones' },
    { id: 'ads-packages', label: 'Package Plans & Pricing' },
    { id: 'ads-ai-generator', label: 'AI Ad Generator' },
    { id: 'ads-templates', label: 'Free Templates & Sheet Sync' }
  ]
};
