/**
 * Create Wish Feature - Global Configurations & Schemas
 * Path: admin/features/create-wish/create-wish-config.js
 */

export const WISH_CATEGORIES = {
  TEXT: 'text',
  IMAGE: 'image',
  AUDIO: 'audio',
  VIDEO: 'video',
  INTERACTIVE: 'interactive',
  STORY: 'story',
  AI: 'ai'
};

export const SHEET_CONFIG = {
  categorySheets: {
    [WISH_CATEGORIES.TEXT]: 'SHEET_TEXT_WISHES',
    [WISH_CATEGORIES.IMAGE]: 'SHEET_IMAGE_WISHES',
    [WISH_CATEGORIES.AUDIO]: 'SHEET_AUDIO_WISHES',
    [WISH_CATEGORIES.VIDEO]: 'SHEET_VIDEO_WISHES',
    [WISH_CATEGORIES.INTERACTIVE]: 'SHEET_INTERACTIVE_WISHES'
  }
};

export const CATEGORY_SCHEMAS = {
  [WISH_CATEGORIES.TEXT]: ['Title', 'Content'],
  [WISH_CATEGORIES.IMAGE]: ['Title', 'Image_CDN_URL'],
  [WISH_CATEGORIES.AUDIO]: ['Title', 'Audio_CDN_URL'],
  [WISH_CATEGORIES.INTERACTIVE]: ['Title', 'WidgetConfig']
};
