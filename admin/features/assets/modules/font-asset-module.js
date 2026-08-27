/**
 * Typography & Font Asset Sub-Module
 * Path: admin/features/assets/modules/font-asset-module.js
 */

export class FontAssetModule {
  static getSchema() {
    return {
      id: '',
      fontName: '',
      fontFamily: '',
      fontFileUrl: '',
      sampleText: 'Happy Birthday!',
      tags: ['#font', '#typography']
    };
  }

  static renderCard(item) {
    return `
      <div class="asset-card font-card" data-id="${item.id}">
        <div class="card-preview font-preview" style="font-family: ${item.fontFamily || 'sans-serif'};">
          ${item.sampleText || 'Happy Birthday!'}
        </div>
        <div class="card-info">
          <h4>${item.fontName || item.id}</h4>
          <p>Font Family: ${item.fontFamily || 'Sans-Serif'}</p>
        </div>
      </div>
    `;
  }
}
