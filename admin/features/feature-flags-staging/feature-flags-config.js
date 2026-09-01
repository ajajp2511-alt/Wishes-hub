/**
 * Advanced Feature Flags & Staging Configuration
 * Path: admin/features/feature-flags-staging/feature-flags-config.js
 */

export const FLAGS_CONFIG = Object.freeze({
  version: '2.0.0',
  defaultFlags: [
    {
      id: 'flag_ai_generator',
      name: 'AI Card Generator',
      enabled: true,
      rolloutPercentage: 100,
      environment: 'production',
      errorThreshold: 5.0, // 5% error limit for kill-switch
      payload: { maxDailyGenerations: 10, engineVersion: 'v2' }
    },
    {
      id: 'flag_3d_canvas',
      name: '3D Canvas Rendering',
      enabled: true,
      rolloutPercentage: 25, // Gradual rollout to 25% users
      environment: 'staging',
      errorThreshold: 2.0,
      payload: { renderQuality: 'high', enableParticles: true }
    },
    {
      id: 'flag_chaos_testing',
      name: 'Latency & Chaos Injector',
      enabled: false,
      rolloutPercentage: 0,
      environment: 'staging',
      errorThreshold: 10.0,
      payload: { simulatedDelayMs: 800 }
    }
  ],
  auditLogLimit: 50,
  sandboxEndpoints: {
    syncUrl: '/api/staging/sync',
    rollbackUrl: '/api/staging/rollback'
  }
});

/**
 * Validates whether a flag configuration object meets basic schema requirements
 * @param {Object} flag 
 * @returns {boolean}
 */
export const validateFlagConfig = (flag) => {
  if (!flag || typeof flag !== 'object') return false;
  
  const hasValidId = typeof flag.id === 'string' && flag.id.trim() !== '';
  const hasValidName = typeof flag.name === 'string' && flag.name.trim() !== '';
  const hasValidRollout = typeof flag.rolloutPercentage === 'number' && 
                          flag.rolloutPercentage >= 0 && 
                          flag.rolloutPercentage <= 100;
  const hasValidEnabled = typeof flag.enabled === 'boolean';

  return hasValidId && hasValidName && hasValidRollout && hasValidEnabled;
};
