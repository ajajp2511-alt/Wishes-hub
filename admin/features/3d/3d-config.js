/**
 * 3D Engine Global Configuration & Constants
 * Path: wishes-hub/admin/features/3d/3d-config.js
 */

export const THREE_CONFIG = {
  // Storage & API Endpoints
  TELEGRAM_BOT_API: 'https://api.telegram.org/bot',
  SHA256_CHECK_ENDPOINT: '/api/v1/3d/assets/check-hash',
  STORAGE_CDN_BASE: 'https://cdn.wishes-hub.com/3d-assets/',

  // WebGL & Rendering Parameters
  VIEWER: {
    DEFAULT_BG_COLOR: 0x0a0a12,
    FOV: 45,
    NEAR: 0.1,
    FAR: 1000,
    SHADOWS_ENABLED: true,
    PIXEL_RATIO_LIMIT: 2
  },

  // Security & Geofence Defaults
  GEOFENCE: {
    MAX_RADIUS_METERS: 1000, // Strictly capped at 1 km
    DEFAULT_RADIUS_METERS: 100,
    REQUIRE_MUTUAL_CONSENT: true,
    ALLOW_SAFE_PIN_OVERRIDE: true
  },

  // Security Lock Defaults
  SECURITY: {
    PIN_LENGTH: 4,
    MAX_PIN_ATTEMPTS: 5,
    LOCKOUT_TIME_MS: 300000 // 5 Minutes
  },

  // Supported Asset Types & Formats
  ASSET_TYPES: {
    GLTF: '.gltf',
    GLB: '.glb',
    OBJ: '.obj',
    TEXTURE_JPG: '.jpg',
    TEXTURE_PNG: '.png',
    TEXTURE_WEBP: '.webp'
  }
};
