/**
 * Create Wish Feature - Configuration & Schemas
 * Path: admin/features/create-wish/create-wish-config.js
 */

export const WISH_CATEGORIES = {
  TEXT: 'text',
  IMAGE: 'image',
  AUDIO: 'audio',
  VIDEO: 'video',
  STORY: 'story',
  INTERACTIVE: 'interactive',
  AI: 'ai'
};

// Default Sheet Mapping Configuration (Can be updated dynamically)
export const SHEET_CONFIG = {
  masterLedgerId: 'MASTER_LEDGER_SHEET_ID_HERE',
  categorySheets: {
    [WISH_CATEGORIES.TEXT]: '',        // Sheet ID for Text Wishes
    [WISH_CATEGORIES.IMAGE]: '',       // Sheet ID for Image Wishes
    [WISH_CATEGORIES.AUDIO]: '',       // Sheet ID for Audio Wishes
    [WISH_CATEGORIES.VIDEO]: '',       // Sheet ID for Video Wishes
    [WISH_CATEGORIES.STORY]: '',       // Sheet ID for Story Wishes
    [WISH_CATEGORIES.INTERACTIVE]: '', // Sheet ID for Interactive Wishes
    [WISH_CATEGORIES.AI]: ''           // Sheet ID for AI Wishes
  }
};

// Dynamic Schema Definitions per Category
export const CATEGORY_SCHEMAS = {
  [WISH_CATEGORIES.TEXT]: [
    'Wish_ID', 'Title', 'Content', 'Language', 'Tone', 
    'Share_URL', 'QR_Code', 'Status', 'Scheduled_At', 'Created_At'
  ],
  [WISH_CATEGORIES.IMAGE]: [
    'Wish_ID', 'Title', 'Image_CDN_URL', 'Caption', 'Overlay_Text', 
    'Share_URL', 'QR_Code', 'Status', 'Scheduled_At', 'Created_At'
  ],
  [WISH_CATEGORIES.AUDIO]: [
    'Wish_ID', 'Title', 'Audio_CDN_URL', 'BGM_Track', 'Voiceover_URL', 
    'Share_URL', 'QR_Code', 'Status', 'Scheduled_At', 'Created_At'
  ],
  [WISH_CATEGORIES.VIDEO]: [
    'Wish_ID', 'Title', 'Video_CDN_URL', 'Thumbnail_URL', 'Duration', 
    'Share_URL', 'QR_Code', 'Status', 'Scheduled_At', 'Created_At'
  ],
  [WISH_CATEGORIES.STORY]: [
    'Wish_ID', 'Title', 'Story_Pages_JSON', 'Background_Theme', 
    'Share_URL', 'QR_Code', 'Status', 'Scheduled_At', 'Created_At'
  ],
  [WISH_CATEGORIES.INTERACTIVE]: [
    'Wish_ID', 'Title', 'Widget_Type', 'Passcode_PIN', 'Effect_Config_JSON', 
    'Share_URL', 'QR_Code', 'Status', 'Scheduled_At', 'Created_At'
  ],
  [WISH_CATEGORIES.AI]: [
    'Wish_ID', 'Prompt_Used', 'Generated_Content', 'AI_Model', 'Style_Preset', 
    'Share_URL', 'QR_Code', 'Status', 'Scheduled_At', 'Created_At'
  ]
};

// Default Settings for Features
export const MODULE_SETTINGS = {
  enableAutoDriveCreate: true,
  autoCompressMedia: true,
  defaultLanguage: 'hi', // Hindi default
  supportedLanguages: ['hi', 'en', 'mr', 'gu', 'bn']
};
