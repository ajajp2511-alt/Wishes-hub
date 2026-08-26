/**
 * Assets & Inventory Hub - Configuration & Schemas
 * Path: admin/features/assets/assets-config.js
 */

export const ASSET_CATEGORIES = {
  ANIMATIONS: 'animations',
  SONGS: 'songs',
  INVITATIONS: 'invitations',
  PARTICLES: 'particles',
  FONTS: 'fonts',
  FRAMES: 'frames',
  STICKERS: 'stickers',
  PALETTES: 'palettes'
};

export const ASSET_CONFIG = {
  maxFileSizeMB: 15,
  allowedImageFormats: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'],
  allowedAudioFormats: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/aac'],
  allowedFontFormats: ['font/ttf', 'font/woff', 'font/woff2'],
  cdnEndpoints: {
    upload: '/api/assets/upload',
    delete: '/api/assets/delete',
    compress: '/api/assets/compress'
  },
  defaultItemsPerPage: 20
};

export const ASSET_STATUSES = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  ARCHIVED: 'Archived',
  PROCESSING: 'Processing'
};

export const CATEGORY_PRESETS = [
  { id: 'animations', label: 'Animation List', icon: '🎬' },
  { id: 'songs', label: 'Song ID List', icon: '🎵' },
  { id: 'invitations', label: 'Invitation Card List', icon: '💌' },
  { id: 'particles', label: 'Particle & Effect List', icon: '✨' },
  { id: 'fonts', label: 'Typography & Font List', icon: '✍️' },
  { id: 'frames', label: 'Frame & Border List', icon: '🖼️' },
  { id: 'stickers', label: 'Sticker & Emoji List', icon: '🎨' },
  { id: 'palettes', label: 'Color Palette Presets', icon: '🎨' }
];
