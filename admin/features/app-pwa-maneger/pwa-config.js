/**
 * App & PWA Manager - Central Configuration
 * Path: admin/features/app-pwa-manager/pwa-config.js
 */

export const PWA_CONFIG = {
  version: '2.1.0',
  manifest: {
    name: 'Wishes Hub - Custom Greetings Platform',
    short_name: 'Wishes Hub',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0d1117',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' }
    ],
    shortcuts: [
      { name: 'Create Wish', url: '/create', icon: '/icons/shortcut-create.png' },
      { name: 'My Inventory', url: '/inventory', icon: '/icons/shortcut-inventory.png' }
    ]
  },
  cacheStrategies: {
    staticAssets: 'CacheFirst',
    apiEndpoints: 'NetworkFirst',
    images: 'StaleWhileRevalidate'
  },
  networkThresholds: {
    effectiveType2G: 'data-saver-mode',
    rttLimitMs: 400
  },
  endpoints: {
    pushRegister: '/api/pwa/push/register',
    pushUnregister: '/api/pwa/push/unregister',
    deepLinksUpdate: '/api/pwa/deeplinks/sync'
  }
};
