/**
 * Color Palette Asset Sub-Module
 * Path: admin/features/assets/modules/palette-asset-module.js
 */

export class PaletteAssetModule {
  static getSchema() {
    return {
      id: '',
      paletteName: '',
      primaryColor: '#6366f1',
      secondaryColor: '#4f46e5',
      backgroundColor: '#f8fafc',
      textColor: '#0f172a',
      tags: ['#color_preset']
    };
  }

  static renderCard(item) {
    return `
      <div class="asset-card palette-card" data-id="${item.id}">
        <div class="card-preview palette-preview" style="display: flex; gap: 4px; padding: 10px;">
          <span style="background: ${item.primaryColor || '#6366f1'}; flex: 1; height: 100%; border-radius: 4px;"></span>
          <span style="background: ${item.secondaryColor || '#4f46e5'}; flex: 1; height: 100%; border-radius: 4px;"></span>
          <span style="background: ${item.backgroundColor || '#f8fafc'}; flex: 1; height: 100%; border-radius: 4px;"></span>
        </div>
        <div class="card-info">
          <h4>${item.paletteName || item.id}</h4>
          <p>${item.primaryColor} • ${item.secondaryColor}</p>
        </div>
      </div>
    `;
  }
}
