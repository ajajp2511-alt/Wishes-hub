/**
 * Main Assembly Controller - Media Manager
 * Path: admin/features/media-manager/media-assembly.js
 */

import { mediaCoreInstance } from './media-core.js';
import { TelegramStorageEngineModule } from './modules/telegram-storage-engine.js';
import { ImagesSvgsModule } from './modules/images-svgs.js';
import { AudioTracksModule } from './modules/audio-tracks.js';
import { StickersOverlaysModule } from './modules/stickers-overlays.js';
import { CloudStorageSyncModule } from './modules/cloud-storage-sync.js';
import { MediaTransformApiModule } from './modules/media-transform-api.js';
import { AssetProtectionDrmModule } from './modules/asset-protection-drm.js';

export class MediaAssembly {
  constructor() {
    this.container = null;
    this.activeSubTab = 'telegram-storage';
  }

  init(rootId) {
    this.container = document.getElementById(rootId);
    if (!this.container) return;

    this.renderLayout();
    this.attachEventListeners();
  }

  renderLayout() {
    this.container.innerHTML = `
      <div class="media-container" style="padding:16px;">
        <header style="margin-bottom:20px;">
          <h2 style="margin:0;">Media Manager (Telegram Storage Powered)</h2>
          <small style="color:#6e7681;">Images, Audio, Stickers, Telegram Hosting & Asset Protection</small>
        </header>

        <nav style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:20px;">
          <button class="tab-btn active" data-subtab="telegram-storage">Telegram Storage Engine</button>
          <button class="tab-btn" data-subtab="images-svgs">Images & SVGs</button>
          <button class="tab-btn" data-subtab="audio-tracks">Audio Tracks</button>
          <button class="tab-btn" data-subtab="stickers-overlays">Stickers & Overlays</button>
          <button class="tab-btn" data-subtab="cloud-storage">Storage Analytics</button>
          <button class="tab-btn" data-subtab="media-transform">Transform API</button>
          <button class="tab-btn" data-subtab="asset-protection">DRM & Licenses</button>
        </nav>

        <main id="media-main-view"></main>
      </div>
    `;

    this.renderActiveSubTab();
  }

  renderActiveSubTab() {
    const view = this.container.querySelector('#media-main-view');
    if (!view) return;

    switch (this.activeSubTab) {
      case 'telegram-storage': TelegramStorageEngineModule.render(view, mediaCoreInstance); break;
      case 'images-svgs': ImagesSvgsModule.render(view, mediaCoreInstance); break;
      case 'audio-tracks': AudioTracksModule.render(view, mediaCoreInstance); break;
      case 'stickers-overlays': StickersOverlaysModule.render(view); break;
      case 'cloud-storage': CloudStorageSyncModule.render(view); break;
      case 'media-transform': MediaTransformApiModule.render(view); break;
      case 'asset-protection': AssetProtectionDrmModule.render(view); break;
      default: TelegramStorageEngineModule.render(view, mediaCoreInstance); break;
    }
  }

  attachEventListeners() {
    this.container.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.container.querySelectorAll('.tab-btn').forEach(b => {
          b.classList.remove('active');
          b.style.fontWeight = 'normal';
        });
        
        e.target.classList.add('active');
        e.target.style.fontWeight = 'bold';
        
        this.activeSubTab = e.target.dataset.subtab;
        this.renderActiveSubTab();
      });
    });
  }
}

export const mediaAssemblyInstance = new MediaAssembly();
