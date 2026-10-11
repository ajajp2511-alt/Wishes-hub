/**
 * A/B Testing Core Engine (Optimized & Extensible)
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
      { testId: 'EXP-101', variantA_CTR: 4.2, variantB_CTR: 6.8, confidence: 0.974, winner: 'Variant B' },
      { testId: 'EXP-102', variantA_CTR: 3.1, variantB_CTR: 3.3, confidence: 0.620, winner: 'Pending' }
    ];
  }

  getActiveTests() { 
    return this.activeTests; 
  }

  getMetrics() { 
    return this.metrics; 
  }

  calculateWinner(testId) {
    const metric = this.metrics.find(m => m.testId === testId);
    if (!metric) return { winner: 'Unknown', status: 'Not Found' };

    // Check if confidence meets the minimum threshold from config (e.g., 95%)
    const isSignificant = metric.confidence >= AB_CONFIG.minConfidenceThreshold;
    
    return {
      ...metric,
      isStatisticallySignificant: isSignificant,
      thresholdRequired: AB_CONFIG.minConfidenceThreshold * 100 + '%'
    };
  }

  addTest(testData) {
    const newTest = {
      id: `EXP-${Date.now().toString().slice(-3)}`,
      status: 'Running',
      split: `${AB_CONFIG.defaultSplitRatio[0]}/${AB_CONFIG.defaultSplitRatio[1]}`,
      ...testData
    };
    this.activeTests.push(newTest);
    return newTest;
  }
}

export const abCoreInstance = new ABCore();
