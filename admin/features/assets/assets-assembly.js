/**
 * Assets & Inventory Hub - UI Assembly & Interface Controller
 * Path: admin/features/assets/assets-assembly.js
 */

import { CATEGORY_PRESETS, ASSET_CATEGORIES } from './assets-config.js';
import { assetsCoreInstance } from './assets-core.js';

// Importing Sub-Modules directly
import { AnimationAssetModule } from './modules/animation-asset-module.js';
import { AudioAssetModule } from './modules/audio-asset-module.js';
import { InvitationAssetModule } from './modules/invitation-asset-module.js';
import { ParticleAssetModule } from './modules/particle-asset-module.js';
import { FontAssetModule } from './modules/font-asset-module.js';
import { FrameAssetModule } from './modules/frame-asset-module.js';
import { StickerAssetModule } from './modules/sticker-asset-module.js';
import { PaletteAssetModule } from './modules/palette-asset-module.js';

export class AssetsAssembly {
  constructor() {
    this.container = null;
    
    // Mapping subId keys from features-assembly.js to internal ASSET_CATEGORIES
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
   * @param {string} rootId - Dynamic root container element ID
   * @param {string} subId - Feature router route key (e.g. 'asset-songs')
   */
  async init(rootId = 'dynamic-content-root', subId = 'asset-animations') {
    this.container = document.getElementById(rootId);
    if (!this.container) return;

    // Determine starting category based on active sidebar route subId
    const targetCategory = this.subIdMap[subId] || ASSET_CATEGORIES.ANIMATIONS || 'animations';

    this.renderSkeleton(targetCategory);
    this.attachEventListeners();
    await this.switchCategory(targetCategory);
  }

  /**
   * Render Base UI Skeleton
   */
  renderSkeleton(initialCategory) {
    this.container.innerHTML = `
      <div class="assets-hub-layout">
        <!-- Sidebar Navigation -->
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

        <!-- Main Workspace -->
        <main class="assets-workspace">
          <!-- Top Bar & Search -->
          <header class="assets-toolbar">
            <div class="search-box">
              <input type="text" id="asset-search-input" placeholder="Search by name or ID..." />
            </div>
            <div class="toolbar-actions">
              <button id="btn-open-upload-modal" class="btn-primary">+ Add New Asset</button>
            </div>
          </header>

          <!-- Asset Grid Container -->
          <section id="asset-grid-view" class="assets-grid-container">
            <div class="loading-spinner">Loading Assets...</div>
          </section>

          <!-- Pagination Bar -->
          <footer id="assets-pagination" class="pagination-container"></footer>
        </main>
      </div>

      <!-- Upload Modal Wrapper -->
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

  /**
   * Switch Active Category
   */
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
    
    this.renderGrid();
  }

  /**
   * Render Items Grid View using modular processors
   */
  renderGrid() {
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

    gridView.innerHTML = paginated.items.map(item => {
      switch (currentCat) {
        case ASSET_CATEGORIES.ANIMATIONS:
          return AnimationAssetModule.renderCard(item);
        case ASSET_CATEGORIES.SONGS:
          return AudioAssetModule.renderCard(item);
        case ASSET_CATEGORIES.INVITATIONS:
          return InvitationAssetModule.renderCard(item);
        case ASSET_CATEGORIES.PARTICLES:
          return ParticleAssetModule.renderCard(item);
        case ASSET_CATEGORIES.FONTS:
          return FontAssetModule.renderCard(item);
        case ASSET_CATEGORIES.FRAMES:
          return FrameAssetModule.renderCard(item);
        case ASSET_CATEGORIES.STICKERS:
          return StickerAssetModule.renderCard(item);
        case ASSET_CATEGORIES.PALETTES:
          return PaletteAssetModule.renderCard(item);
        default:
          return `
            <div class="asset-card" data-id="${item.id}">
              <div class="card-info">
                <h4>${item.title || item.id}</h4>
              </div>
            </div>
          `;
      }
    }).join('');
  }

  /**
   * Attach Event Listeners
   */
  attachEventListeners() {
    // Category Navigation Click
    this.container.querySelectorAll('.nav-item-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const cat = e.currentTarget.dataset.category;
        this.switchCategory(cat);
      });
    });

    // Search Input Event
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

    // Modal Events
    const openModalBtn = this.container.querySelector('#btn-open-upload-modal');
    const closeModalBtn = this.container.querySelector('#btn-close-modal');
    const modal = this.container.querySelector('#upload-modal');

    if (openModalBtn && modal) openModalBtn.addEventListener('click', () => modal.classList.remove('hidden'));
    if (closeModalBtn && modal) closeModalBtn.addEventListener('click', () => modal.classList.add('hidden'));
  }
}

// Global exported instance
export const assetsAssemblyInstance = new AssetsAssembly();

// Universal export function for features-assembly router compatibility
export async function init(rootId, subId) {
  await assetsAssemblyInstance.init(rootId, subId);
        }
