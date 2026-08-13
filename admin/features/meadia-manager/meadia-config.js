/**
 * Media Manager Configuration
 * Path: admin/features/media-manager/media-config.js
 */

export const MEDIA_CONFIG = {
  version: '1.0.0',
  storageProvider: 'TELEGRAM', // Options: 'TELEGRAM', 'S3', 'LOCAL'
  telegram: {
    botToken: 'YOUR_TELEGRAM_BOT_TOKEN', // Set in admin env/settings
    chatId: '@your_private_storage_channel',
    apiEndpoint: 'https://api.telegram.org/bot'
  },
  supportedTypes: {
    images: ['jpg', 'png', 'webp', 'svg'],
    audio: ['mp3', 'wav', 'aac'],
    stickers: ['gif', 'webp']
  }
};
