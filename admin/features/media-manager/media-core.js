/**
 * Media Manager Core Engine
 * Path: admin/features/media-manager/media-core.js
 */

import { MEDIA_CONFIG } from './media-config.js';

export class MediaCore {
  constructor() {
    this.mediaLibrary = [
      { id: 'm_101', name: 'gold_diya_3d.png', type: 'image', provider: 'Telegram', telegramFileId: 'AgACAgI...', size: '240 KB' },
      { id: 'm_102', name: 'festive_flute.mp3', type: 'audio', provider: 'Telegram', telegramFileId: 'BqACAgI...', size: '1.2 MB' }
    ];
  }

  getMediaItems(type = null) {
    if (!type) return this.mediaLibrary;
    return this.mediaLibrary.filter(item => item.type === type);
  }

  addMediaItem(item) {
    const newItem = {
      id: `m_${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...item
    };
    this.mediaLibrary.unshift(newItem);
    return newItem;
  }
}

export const mediaCoreInstance = new MediaCore();
