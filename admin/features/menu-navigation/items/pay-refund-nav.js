/**
 * Path: admin/features/menu-navigation/items/pay-refund-nav.js
 */

export const payRefundNavItem = {
  id: 'pay-and-refund',
  label: 'Pay & Refund',
  icon: '💳',
  subItems: [
    { id: 'pay-gateways', label: 'Fiat & Crypto Gateways' },
    { id: 'pay-refund-policies', label: 'Refund Policies' },
    { id: 'pay-tax-surcharge', label: 'Tax & Surcharge' },
    { id: 'pay-security', label: 'Payment Security' }
  ]
};
