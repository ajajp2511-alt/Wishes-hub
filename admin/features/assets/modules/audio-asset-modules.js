/**
 * Audio / Song Asset Sub-Module
 * Path: admin/features/assets/modules/audio-asset-module.js
 */

export class AudioAssetModule {
  static getSchema() {
    return {
      id: '',
      songName: '',
      artist: '',
      audioUrl: '',
      durationSec: 0,
      genre: 'Pop',
      tags: ['#background_music']
    };
  }

  static renderCard(item) {
    return `
      <div class="asset-card audio-card" data-id="${item.id}">
        <div class="card-preview audio-preview">
          <i class="fa-solid fa-music"></i>
        </div>
        <div class="card-info">
          <h4>${item.songName || item.id}</h4>
          <p>${item.artist || 'Unknown Artist'} • ${item.genre || 'Audio'}</p>
        </div>
      </div>
    `;
  }
}
