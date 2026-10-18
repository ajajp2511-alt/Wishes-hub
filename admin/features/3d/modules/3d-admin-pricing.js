/**
 * 3D Admin Pricing & Access Override Module
 * Path: wishes-hub/admin/features/3d/modules/3d-admin-pricing.js
 */

import { THREE_CONFIG } from '../3d-config.js';
import { coreEngine } from '../3d-core.js';

export class AdminPricing {
  constructor() {
    this.moduleName = '3d-admin-pricing';
    this.pricingRules = new Map();
    this.init();
  }

  init() {
    coreEngine.registerModule(this.moduleName, this);
    console.log(`[Module] ${this.moduleName} initialized.`);
  }

  // Set or override pricing for a specific asset hash or category
  async setAssetPrice(assetHash, pricingConfig) {
    if (!assetHash) {
      throw new Error('[Admin Pricing] Asset hash is required.');
    }

    const payload = {
      assetHash,
      priceINR: pricingConfig.priceINR ?? 0,
      isFree: pricingConfig.isFree ?? false,
      tier: pricingConfig.tier || 'Standard',
      discountPercentage: pricingConfig.discountPercentage || 0,
      updatedAt: Date.now()
    };

    try {
      const response = await fetch('/api/v1/3d/admin/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('[Admin Pricing] Server price update failed.');
      }

      const result = await response.json();
      this.pricingRules.set(assetHash, payload);
      coreEngine.emit('pricing:updated', payload);
      return result;
    } catch (error) {
      console.error('[Admin Pricing Error]', error);
      throw error;
    }
  }

  // Admin access override for unlocking asset globally or per user
  async setAccessOverride(assetHash, overrideRule) {
    const payload = {
      assetHash,
      isUnlockedForEveryone: overrideRule.isUnlockedForEveryone ?? false,
      whitelistedUserIds: overrideRule.whitelistedUserIds || [],
      overrideReason: overrideRule.reason || 'Admin Grant'
    };

    const response = await fetch('/api/v1/3d/admin/access-override', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error('[Admin Pricing] Access override sync failed.');
    }

    coreEngine.emit('pricing:access:overridden', payload);
    return await response.json();
  }
}

export default AdminPricing;
