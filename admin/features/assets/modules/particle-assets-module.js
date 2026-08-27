/**
 * Particle & Effect Asset Sub-Module
 * Path: admin/features/assets/modules/particle-asset-module.js
 */

export class ParticleAssetModule {
  static getSchema() {
    return {
      id: '',
      effectName: '',
      particleType: 'confetti',
      density: 50,
      speed: 2,
      tags: ['#effect', '#particles']
    };
  }

  static renderCard(item) {
    return `
      <div class="asset-card particle-card" data-id="${item.id}">
        <div class="card-preview particle-preview">
          <i class="fa-solid fa-wand-magic-sparkles"></i>
          <span>${item.particleType || 'Effect'}</span>
        </div>
        <div class="card-info">
          <h4>${item.effectName || item.id}</h4>
          <p>Density: ${item.density || 50} • Speed: ${item.speed || 1}x</p>
        </div>
      </div>
    `;
  }
}
