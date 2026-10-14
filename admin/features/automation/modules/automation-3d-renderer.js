/**
 * 3D Immersive Parallax & Gyroscope Engine
 * Path: admin/features/automation/modules/automation-3d-renderer.js
 * Description: Renders 3D layered cards, particle effect backgrounds, gyroscope controls,
 *              and manages 3D dynamic price monetization rules.
 */

import { AUTOMATION_CONFIG } from '../automation-config.js';
import { automationCore } from '../automation-core.js';

export class Automation3DRendererEngine {
  constructor() {
    this.config = AUTOMATION_CONFIG;
    this.core = automationCore;
  }

  /**
   * Get Current 3D Price based on User Currency
   */
  get3DPriceConfig(currencyCode = 'INR') {
    const monetization = this.config.monetization3D;
    const priceTier = monetization.currencyDefaults[currencyCode] || monetization.currencyDefaults['INR'];

    return {
      enabled: monetization.enabled,
      price: priceTier.price,
      compareAt: priceTier.compareAt,
      symbol: priceTier.symbol,
      formattedPrice: `${priceTier.symbol}${priceTier.price}`,
      shareToUnlockThreshold: monetization.shareToUnlockFreeThreshold
    };
  }

  /**
   * Update 3D Pricing via Admin Panel
   */
  update3DPricing(currencyCode, newPrice, newCompareAt) {
    if (!this.config.monetization3D.currencyDefaults[currencyCode]) {
      this.config.monetization3D.currencyDefaults[currencyCode] = { symbol: '₹', price: newPrice, compareAt: newCompareAt };
    } else {
      this.config.monetization3D.currencyDefaults[currencyCode].price = newPrice;
      this.config.monetization3D.currencyDefaults[currencyCode].compareAt = newCompareAt;
    }

    this.core.log('3D_RENDERER', `Updated 3D Price for ${currencyCode}: ${newPrice}`, 'SUCCESS');
    return this.get3DPriceConfig(currencyCode);
  }

  /**
   * Build 3D Particle & Parallax Scene Metadata
   */
  build3DSceneMetadata(festivalId) {
    const sceneConfigs = {
      fest_diwali: {
        particleType: 'golden_diyas_sparks',
        particleCount: 45,
        backgroundColor: '#1a0933',
        parallaxDepthLayers: 3,
        ambientLighting: 'warm_golden',
        gyroscopeSensitivity: 1.5
      },
      fest_newyear: {
        particleType: 'fireworks_burst',
        particleCount: 60,
        backgroundColor: '#0a0a23',
        parallaxDepthLayers: 4,
        ambientLighting: 'neon_multi',
        gyroscopeSensitivity: 2.0
      },
      fest_christmas: {
        particleType: 'snowflakes_falling',
        particleCount: 50,
        backgroundColor: '#0f2027',
        parallaxDepthLayers: 3,
        ambientLighting: 'cool_soft_white',
        gyroscopeSensitivity: 1.2
      },
      default: {
        particleType: 'floating_glitter',
        particleCount: 30,
        backgroundColor: '#121212',
        parallaxDepthLayers: 2,
        ambientLighting: 'soft_ambient',
        gyroscopeSensitivity: 1.0
      }
    };

    const scene = sceneConfigs[festivalId] || sceneConfigs['default'];
    this.core.log('3D_RENDERER', `Generated 3D Scene config for ${festivalId}`, 'INFO');
    return scene;
  }
}

export const automation3DRenderer = new Automation3DRendererEngine();
