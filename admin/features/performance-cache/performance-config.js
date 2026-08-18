/**
 * Performance & Cache Configuration
 * Path: admin/features/performance-cache/performance-config.js
 */

export const PERFORMANCE_CONFIG = {
  version: '1.0.0',
  cdnProvider: 'Vercel Edge / Cloudflare',
  redisTTLDefault: 3600, // 1 hour in seconds
  imageTargetFormat: 'webp',
  compressionQuality: 85,
  enableBrotli: true
};
