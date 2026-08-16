/**
 * A/B Testing Studio Configuration
 * Path: admin/features/ab-testing/ab-config.js
 */

export const AB_CONFIG = {
  version: '1.0.0',
  defaultSplitRatio: [50, 50],
  minConfidenceThreshold: 0.95, // 95% statistical confidence
  enableMAB: true,
  edgeRenderEnabled: true
};
