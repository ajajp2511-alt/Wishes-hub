/**
 * Frame & Border Asset Sub-Module
 * Path: admin/features/assets/modules/frame-asset-module.js
 */

export class FrameAssetModule {
  static getSchema() {
    return {
      id: '',
      frameName: '',
      frameImageUrl: '',
      aspectRatio: '1:1',
      tags: ['#photo_frame']
    };
  }

  static renderCard(item) {
    return `
      <div class="asset-card frame-card" data-id="${item.id}">
        <div class="card-preview image-preview">
          <img src="${item.frameImageUrl || 'https://via.placeholder.com/150'}" alt="${item.frameName || 'Frame'}" />
        </div>
        <div class="card-info">
          <h4>${item.frameName || item.id}</h4>
          <p>Ratio: ${item.aspectRatio || '1:1'}</p>
        </div>
      </div>
    `;
  }
}
