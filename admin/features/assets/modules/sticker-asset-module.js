/**
 * Sticker & Emoji Asset Sub-Module
 * Path: admin/features/assets/modules/sticker-asset-module.js
 */

export class StickerAssetModule {
  static getSchema() {
    return {
      id: '',
      stickerName: '',
      imageUrl: '',
      isAnimated: false,
      tags: ['#sticker']
    };
  }

  static renderCard(item) {
    return `
      <div class="asset-card sticker-card" data-id="${item.id}">
        <div class="card-preview image-preview">
          <img src="${item.imageUrl || 'https://via.placeholder.com/150'}" alt="${item.stickerName || 'Sticker'}" />
        </div>
        <div class="card-info">
          <h4>${item.stickerName || item.id}</h4>
          <p>${item.isAnimated ? 'Animated Sticker' : 'Static Sticker'}</p>
        </div>
      </div>
    `;
  }
}
