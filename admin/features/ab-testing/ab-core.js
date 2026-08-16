/**
 * A/B Testing Core Engine
 * Path: admin/features/ab-testing/ab-core.js
 */

import { AB_CONFIG } from './ab-config.js';

export class ABCore {
  constructor() {
    this.activeTests = [
      { id: 'EXP-101', name: 'Homepage Hero CTA Color', status: 'Running', variantA: 'Green Button', variantB: 'Orange Button', split: '50/50' },
      { id: 'EXP-102', name: 'Festive Card Layout Grid', status: 'Running', variantA: '2-Column Grid', variantB: 'Single Column Stack', split: '70/30' }
    ];

    this.metrics = [
      { testId: 'EXP-101', variantA_CTR: '4.2%', variantB_CTR: '6.8%', confidence: '97.4%', winner: 'Variant B' },
      { testId: 'EXP-102', variantA_CTR: '3.1%', variantB_CTR: '3.3%', confidence: '62.0%', winner: 'Pending' }
    ];
  }

  getActiveTests() { return this.activeTests; }
  getMetrics() { return this.metrics; }

  calculateWinner(testId) {
    const metric = this.metrics.find(m => m.testId === testId);
    if (!metric) return { winner: 'Unknown', status: 'Not Found' };
    return metric;
  }
}

export const abCoreInstance = new ABCore();
