/**
 * Assets & Inventory Hub - UI Assembly & Interface Controller
 * Path: admin/features/assets/assets-assembly.js
 */

import { CATEGORY_PRESETS, ASSET_CATEGORIES } from './assets-config.js';
import { assetsCoreInstance } from './assets-core.js';

export class AssetsAssembly {
  constructor() {
    this.container = null;
    
    this.subIdMap = {
      'asset-animations': ASSET_CATEGORIES.ANIMATIONS || 'animations',
      'asset-songs': ASSET_CATEGORIES.SONGS || 'songs',
      'asset-invitations': ASSET_CATEGORIES.INVITATIONS || 'invitations',
      'asset-particles': ASSET_CATEGORIES.PARTICLES || 'particles',
      'asset-fonts': ASSET_CATEGORIES.FONTS || 'fonts',
      'asset-frames': ASSET_CATEGORIES.FRAMES || 'frames',
      'asset-stickers': ASSET_CATEGORIES.STICKERS || 'stickers',
      'asset-palettes': ASSET_CATEGORIES.PALETTES || 'palettes'
    };
  }

  /**
   * Mount Feature Interface to Root Element
   */
  async init(rootId = 'dynamic-content-root', subId = 'asset-animations') {
    this.container = document.getElementById(rootId);
    if (!this.container) return;

    const targetCategory = this.subIdMap[subId] || ASSET_CATEGORIES.ANIMATIONS || 'animations';

    this.renderSkeleton(targetCategory);
    this.attachEventListeners();
    await this.switchCategory(targetCategory);
  }

  renderSkeleton(initialCategory) {
    this.container.innerHTML = `
      <div class="assets-hub-layout">
        <aside class="assets-sidebar">
          <h3 class="sidebar-title">Asset & Inventory</h3>
          <ul class="category-nav-list">
            ${CATEGORY_PRESETS.map(cat => `
              <li class="nav-item-btn ${cat.id === initialCategory ? 'active' : ''}" data-category="${cat.id}">
                <span class="icon">${cat.icon || '📦'}</span>
                <span class="label">${cat.label}</span>
              </li>
            `).join('')}
          </ul>
        </aside>

        <main class="assets-workspace">
          <header class="assets-toolbar">
            <div class="search-box">
              <input type="text" id="asset-search-input" placeholder="Search by name or ID..." />
            </div>
            <div class="toolbar-actions">
              <button id="btn-open-upload-modal" class="btn-primary">+ Add New Asset</button>
            </div>
          </header>

          <section id="asset-grid-view" class="assets-grid-container">
            <div class="loading-spinner">Loading Assets...</div>
          </section>

          <footer id="assets-pagination" class="pagination-container"></footer>
        </main>
      </div>

      <div id="upload-modal" class="modal-overlay hidden">
        <div class="modal-content">
          <h3>Upload Asset</h3>
          <div id="drop-zone" class="drop-zone-area">
            <p>Drag & Drop files here or click to browse</p>
            <input type="file" id="file-input" multiple class="hidden-input" />
          </div>
          <div class="modal-actions">
            <button id="btn-close-modal" class="btn-secondary">Cancel</button>
          </div>
        </div>
      </div>
    `;
  }

  async switchCategory(categoryId) {
    this.container.querySelectorAll('.nav-item-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.category === categoryId);
    });

    const gridView = this.container.querySelector('#asset-grid-view');
    if (gridView) {
      gridView.innerHTML = `<div class="loading-spinner">Fetching ${categoryId}...</div>`;
    }

    if (assetsCoreInstance && typeof assetsCoreInstance.fetchAssets === 'function') {
      await assetsCoreInstance.fetchAssets(categoryId);
    }
    
    await this.renderGrid();
  }

  /**
   * Safe Dynamic Component Loader
   */
  async renderGrid() {
    const gridView = this.container.querySelector('#asset-grid-view');
    if (!gridView) return;

    const paginated = assetsCoreInstance && typeof assetsCoreInstance.getPaginatedAssets === 'function'
      ? assetsCoreInstance.getPaginatedAssets()
      : { items: [] };

    if (!paginated.items || paginated.items.length === 0) {
      gridView.innerHTML = `<div class="empty-state">No assets found in this category.</div>`;
      return;
    }

    const currentCat = assetsCoreInstance.selectedCategory;

    try {
      let module;
      switch (currentCat) {
        case ASSET_CATEGORIES.ANIMATIONS:
          module = await import('./modules/animation-asset-module.js');
          gridView.innerHTML = paginated.items.map(item => module.AnimationAssetModule.renderCard(item)).join('');
          break;
        case ASSET_CATEGORIES.SONGS:
          module = await import('./modules/audio-asset-module.js');
          gridView.innerHTML = paginated.items.map(item => module.AudioAssetModule.renderCard(item)).join('');
          break;
        case ASSET_CATEGORIES.INVITATIONS:
          module = await import('./modules/invitation-asset-module.js');
          gridView.innerHTML = paginated.items.map(item => module.InvitationAssetModule.renderCard(item)).join('');
          break;
        case ASSET_CATEGORIES.PARTICLES:
          module = await import('./modules/particle-asset-module.js');
          gridView.innerHTML = paginated.items.map(item => module.ParticleAssetModule.renderCard(item)).join('');
          break;
        case ASSET_CATEGORIES.FONTS:
          module = await import('./modules/font-asset-module.js');
          gridView.innerHTML = paginated.items.map(item => module.FontAssetModule.renderCard(item)).join('');
          break;
        case ASSET_CATEGORIES.FRAMES:
          module = await import('./modules/frame-asset-module.js');
          gridView.innerHTML = paginated.items.map(item => module.FrameAssetModule.renderCard(item)).join('');
          break;
        case ASSET_CATEGORIES.STICKERS:
          module = await import('./modules/sticker-asset-module.js');
          gridView.innerHTML = paginated.items.map(item => module.StickerAssetModule.renderCard(item)).join('');
          break;
        case ASSET_CATEGORIES.PALETTES:
          module = await import('./modules/palette-asset-module.js');
          gridView.innerHTML = paginated.items.map(item => module.PaletteAssetModule.renderCard(item)).join('');
          break;
        default:
          gridView.innerHTML = paginated.items.map(item => `
            <div class="asset-card" data-id="${item.id}">
              <div class="card-info">
                <h4>${item.title || item.id}</h4>
              </div>
            </div>
          `).join('');
      }
    } catch (err) {
      console.error("Module Loading Failed:", err);
      gridView.innerHTML = `<div class="empty-state">Failed to load category view module.</div>`;
    }
  }

  attachEventListeners() {
    this.container.querySelectorAll('.nav-item-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const cat = e.currentTarget.dataset.category;
        this.switchCategory(cat);
      });
    });

    const searchInput = this.container.querySelector('#asset-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        if (assetsCoreInstance) {
          assetsCoreInstance.searchQuery = e.target.value;
          if (typeof assetsCoreInstance.applyFilters === 'function') {
            assetsCoreInstance.applyFilters();
          }
        }
        this.renderGrid();
      });
    }

    const openModalBtn = this.container.querySelector('#btn-open-upload-modal');
    const closeModalBtn = this.container.querySelector('#btn-close-modal');
    const modal = this.container.querySelector('#upload-modal');

    if (openModalBtn && modal) openModalBtn.addEventListener('click', () => modal.classList.remove('hidden'));
    if (closeModalBtn && modal) closeModalBtn.addEventListener('click', () => modal.classList.add('hidden'));
  }
}

export const assetsAssemblyInstance = new AssetsAssembly();

export async function init(rootId, subId) {
  await assetsAssemblyInstance.init(rootId, subId);
  }
