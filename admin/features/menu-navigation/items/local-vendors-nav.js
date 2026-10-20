/**
 * Path: admin/features/menu-navigation/items/local-vendors-nav.js
 */
import { VENDOR_CONFIG } from '../../local-vendors/local-vendors-config.js';

export const localVendorsNavItem = {
  id: 'local-vendors',
  label: 'Local Vendors',
  icon: '🏪',
  subItems: [
    { id: 'vendor-types', label: 'Vendor Categories' },
    { id: 'vendor-delivery', label: 'Delivery Modes' },
    { id: 'vendor-commissions', label: 'Commissions & Rates' },
    { id: 'vendor-whatsapp-bot', label: 'WhatsApp Commands' }
  ],
  config: VENDOR_CONFIG
};
