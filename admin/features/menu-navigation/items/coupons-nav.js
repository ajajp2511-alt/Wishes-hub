/**
 * Coupons Marketplace Navigation Item
 * Path: admin/features/menu-navigation/items/coupons-nav.js
 */

export const couponsNavItem = {
  id: 'coupons-module',
  label: 'Coupons Marketplace',
  icon: '🎟️',
  subItems: [
    { id: 'coupons-dashboard', label: 'Marketplace Overview' },
    { id: 'coupons-aggregators', label: 'API Aggregators' },
    { id: 'coupons-financials', label: 'Commission & Cashback' },
    { id: 'coupons-fraud-guard', label: 'Anti-Fraud Rules' },
    { id: 'coupons-currencies', label: 'Currencies & Rates' }
  ]
};
