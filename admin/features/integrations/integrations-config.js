/**
 * Integrations & Webhooks Configuration
 * Path: admin/features/integrations/integrations-config.js
 */

export const INTEGRATIONS_CONFIG = {
  version: '1.0.0',
  maxWebhookRetries: 5,
  hmacAlgorithm: 'sha256',
  defaultRateLimitPerMin: 120,
  sandboxMode: false
};
