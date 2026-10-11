/**
 * A/B Testing Studio Configuration (Optimized & Extensible)
 * Path: admin/features/ab-testing/ab-config.js
 */

export const AB_CONFIG = {
  version: '1.0.0',
  defaultSplitRatio: [50, 50],
  minConfidenceThreshold: 0.95, // 95% statistical confidence
  enableMAB: true,
  edgeRenderEnabled: true,
  
  // Extended limits & operational parameters
  limits: {
    maxVariantsPerTest: 8,
    minSampleSize: 1000,
    autoWinnerCheckIntervalMs: 3600000 // 1 hour
  },

  // Tracking & Cookie settings
  tracking: {
    cookiePrefix: 'wh_ab_',
    cookieExpiryDays: 30,
    sampleRate: 1.0 // 100% traffic tracking by default
  }
};
