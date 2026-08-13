/**
 * Content Engine & Templates Configuration
 * Path: admin/features/content-templates/content-config.js
 */

export const CONTENT_CONFIG = {
  version: '1.0.0',
  defaultCanvasSize: { width: 1080, height: 1920, ratio: '9:16' },
  supportedRatios: ['9:16', '1:1', '16:9'],
  supportedExportFormats: ['PNG', 'WebP', 'JPG', 'MP4', 'GIF'],
  defaultTemplates: [
    { id: 'tpl_c1', title: 'Royal Diwali Celebration', category: 'Festive', rating: 4.9, status: 'Published' },
    { id: 'tpl_c2', title: 'Minimalist Birthday Frame', category: 'Birthday', rating: 4.8, status: 'Published' }
  ]
};
