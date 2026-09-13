/**
 * manage-loading-config.js
 * Configuration settings for Wishes Hub Loading Module
 */
export const LoadingConfig = {
  defaultAnimation: 'spinner',
  defaultTimeout: 10000, // 10 seconds safety timeout
  zIndex: 9999,
  themes: {
    light: { bg: 'rgba(255, 255, 255, 0.85)', color: '#3b82f6' },
    dark: { bg: 'rgba(15, 23, 42, 0.85)', color: '#60a5fa' }
  },
  messages: {
    en: { default: 'Loading...', saving: 'Saving changes...', syncing: 'Syncing database...' },
    hi: { default: 'लोड ho raha hai...', saving: 'Badlaav save ho rahe hain...', syncing: 'Sync ho raha hai...' }
  }
};
