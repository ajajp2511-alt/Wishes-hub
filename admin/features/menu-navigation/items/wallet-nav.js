/**
 * Wallet Manager Nav Item
 * Path: admin/features/menu-navigation/items/wallet-nav.js
 */

export const walletNavItem = {
  id: 'wallet-manager',
  label: 'Wallet & Payouts',
  icon: '💰',
  subItems: [
    { id: 'wallet-overview', label: 'Overview & Ledger' },
    { id: 'wallet-transactions', label: 'Transactions & Escrow' },
    { id: 'wallet-commissions', label: 'Commissions & Tiers' }
  ]
};
