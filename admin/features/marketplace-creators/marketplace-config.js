/**
 * Marketplace & Creators Configuration
 * Path: admin/features/marketplace-creators/marketplace-config.js
 */

export const MARKETPLACE_CONFIG = {
  version: '1.0.0',
  defaultCommissionSplit: { creator: 70, platform: 30 },
  payoutThreshold: 1000, // Min ₹1000 for auto payout
  supportedCurrencies: ['INR', 'USD'],
  defaultTemplates: [
    { id: 'tpl_101', name: 'Royal Gold Diwali Wish', price: 199, sales: 450, creator: 'Aarav Designs', status: 'Active' },
    { id: 'tpl_102', name: 'Minimal 3D Birthday Card', price: 99, sales: 890, creator: 'Priya Studio', status: 'Active' }
  ]
};
