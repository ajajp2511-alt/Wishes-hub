/**
 * Content Engine & Templates Core Engine
 * Path: admin/features/content-templates/content-core.js
 */

import { CONTENT_CONFIG } from './content-config.js';

export class ContentCore {
  constructor() {
    this.templates = [...CONTENT_CONFIG.defaultTemplates];
    this.activeCanvas = {
      width: CONTENT_CONFIG.defaultCanvasSize.width,
      height: CONTENT_CONFIG.defaultCanvasSize.height,
      layers: [
        { id: 'lyr_bg', type: 'image', src: 'diwali_bg.jpg', locked: true },
        { id: 'lyr_txt', type: 'text', content: 'Happy Diwali', font: 'Rozha One', color: '#FFD700' }
      ]
    };
    this.assetPacks = [
      { id: 'pack_1', name: '3D Gold Diyas & Sparkles', itemsCount: 42, category: 'Diwali' },
      { id: 'pack_2', name: 'Floral Arches & Rangoli', itemsCount: 30, category: 'Traditional' }
    ];
  }

  getTemplates() { return this.templates; }
  getActiveCanvas() { return this.activeCanvas; }
  getAssetPacks() { return this.assetPacks; }

  addLayer(layerData) {
    const newLayer = { id: `lyr_${Date.now()}`, ...layerData };
    this.activeCanvas.layers.push(newLayer);
    return newLayer;
  }

  setCanvasRatio(ratio) {
    if (ratio === '1:1') {
      this.activeCanvas.width = 1080;
      this.activeCanvas.height = 1080;
    } else if (ratio === '16:9') {
      this.activeCanvas.width = 1920;
      this.activeCanvas.height = 1080;
    } else {
      this.activeCanvas.width = 1080;
      this.activeCanvas.height = 1920;
    }
  }
}

export const contentCoreInstance = new ContentCore();
