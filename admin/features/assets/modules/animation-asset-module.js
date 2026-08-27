/**
 * Animation Asset Sub-Module
 * Path: admin/features/assets/modules/animation-asset-module.js
 */

export class AnimationAssetModule {
  static getSchema() {
    return {
      id: '',
      title: '',
      lottieUrl: '',
      jsonContent: null,
      speed: 1.0,
      loop: true,
      tags: ['#animation', '#lottie']
    };
  }

  static renderCard(item) {
    return `
      <div class="asset-card animation-card" data-id="${item.id}">
        <div class="card-preview lottie-preview">
          <i class="fa-solid fa-film"></i>
          <span>Speed: ${item.speed || 1}x</span>
        </div>
        <div class="card-info">
          <h4>${item.title || item.id}</h4>
          <p>Lottie Animation</p>
        </div>
      </div>
    `;
  }
}
