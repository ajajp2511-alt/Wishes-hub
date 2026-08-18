/**
 * Price & Plans Core Engine
 * Path: admin/features/price-plans/pricing-core.js
 */

import { PRICING_CONFIG } from './pricing-config.js';

export class PricingCore {
  constructor() {
    this.packages = [
      { id: 'PKG-FREE', name: 'Free Wish Plan', price: 0, interval: 'Lifetime', limits: 'Standard Cards, Watermark Included' },
      { id: 'PKG-VIP', name: 'Festive VIP Pass', price: 99, interval: 'Yearly', limits: 'No Watermark, 3D Audio, HD Exports' },
      { id: 'PKG-BIZ', name: 'Corporate Brand Pass', price: 999, interval: 'Yearly', limits: 'Custom Logo Branding, Bulk Links, API Access' }
    ];

    this.promos = [
      { code: 'DIWALI2026', discount: '30%', usageLimit: 5000, status: 'Active' },
      { code: 'WELCOME10', discount: '10%', usageLimit: 10000, status: 'Active' }
    ];

    this.gateways = [
      { name: 'Razorpay', status: 'Active', mode: 'Live' },
      { name: 'PhonePe', status: 'Active', mode: 'Live' },
      { name: 'Stripe', status: 'Inactive', mode: 'Sandbox' }
    ];
  }

  getPackages() { return this.packages; }
  getPromos() { return this.promos; }
  getGateways() { return this.gateways; }
}

export const pricingCoreInstance = new PricingCore();
