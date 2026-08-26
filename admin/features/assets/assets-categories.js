/**
 * Assets & Inventory Hub - Specific Category Schemas & Item Processors
 * Path: admin/features/assets/assets-categories.js
 */

import { ASSET_CATEGORIES } from './assets-config.js';

export class AssetsCategories {
  /**
   * Get Schema Template for a specific Category
   */
  static getSchema(category) {
    switch (category) {
      case ASSET_CATEGORIES.ANIMATIONS:
        return {
          id: '',
          title: '',
          lottieUrl: '',
          jsonContent: null,
          speed: 1.0,
          loop: true,
          tags: ['#animation', '#lottie']
        };

      case ASSET_CATEGORIES.SONGS:
        return {
          id: '',
          songName: '',
          artist: '',
          audioUrl: '',
          durationSec: 0,
          genre: 'Pop',
          tags: ['#background_music']
        };

      case ASSET_CATEGORIES.INVITATIONS:
        return {
          id: '',
          cardName: '',
          previewImageUrl: '',
          templateHtmlUrl: '',
          theme: 'Birthday',
          tags: ['#invitation_card']
        };

      case ASSET_CATEGORIES.PARTICLES:
        return {
          id: '',
          effectName: '',
          particleType: 'confetti', // confetti, hearts, fireworks
          density: 50,
          speed: 2,
          tags: ['#effect', '#particles']
        };

      case ASSET_CATEGORIES.FONTS:
      case 'typography':
        return {
          id: '',
          fontName: '',
          fontFamily: '',
          fontFileUrl: '',
          sampleText: 'Happy Birthday!',
          tags: ['#font', '#typography']
        };

      case ASSET_CATEGORIES.FRAMES:
        return {
          id: '',
          frameName: '',
          frameImageUrl: '',
          aspectRatio: '1:1',
          tags: ['#photo_frame']
        };

      case ASSET_CATEGORIES.STICKERS:
        return {
          id: '',
          stickerName: '',
          imageUrl: '',
          isAnimated: false,
          tags: ['#sticker']
        };

      case ASSET_CATEGORIES.PALETTES:
        return {
          id: '',
          paletteName: '',
          primaryColor: '#6366f1',
          secondaryColor: '#4f46e5',
          backgroundColor: '#f8fafc',
          textColor: '#0f172a',
          tags: ['#color_preset']
        };

      default:
        return { id: '', title: '', url: '', tags: [] };
    }
  }

  /**
   * Normalize Asset Preview Display Data for Grid Renderers
   */
  static formatItemForPreview(item, category) {
    switch (category) {
      case ASSET_CATEGORIES.ANIMATIONS:
        return {
          title: item.title || item.id,
          subText: `Lottie Animation • Speed: ${item.speed || 1}x`,
          previewType: 'lottie',
          url: item.lottieUrl
        };

      case ASSET_CATEGORIES.SONGS:
        return {
          title: item.songName || item.id,
          subText: `${item.artist || 'Unknown Artist'} • ${item.genre || 'Audio'}`,
          previewType: 'audio',
          url: item.audioUrl
        };

      case ASSET_CATEGORIES.FONTS:
      case 'typography':
        return {
          title: item.fontName || item.id,
          subText: `Font Family: ${item.fontFamily || 'Sans-Serif'}`,
          previewType: 'text',
          sample: item.sampleText || 'Sample Text'
        };

      case ASSET_CATEGORIES.PALETTES:
        return {
          title: item.paletteName || item.id,
          subText: `${item.primaryColor} • ${item.secondaryColor}`,
          previewType: 'colors',
          colors: [item.primaryColor, item.secondaryColor, item.backgroundColor]
        };

      default:
        return {
          title: item.title || item.cardName || item.frameName || item.stickerName || item.id,
          subText: item.tags ? item.tags.join(', ') : '',
          previewType: 'image',
          url: item.imageUrl || item.previewImageUrl || item.frameImageUrl || item.url
        };
    }
  }
  }
