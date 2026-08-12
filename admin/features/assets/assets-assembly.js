/**
 * Assets & Inventory Hub - UI Assembly & Interface Controller
 * Path: admin/features/assets/assets-assembly.js
 */

import { CATEGORY_PRESETS, ASSET_CATEGORIES } from './assets-config.js';
import { assetsCoreInstance } from './assets-core.js';
import { AssetsCategories } from './assets-categories.js';
import { AssetsUploader } from './assets-uploader.js';

export class AssetsAssembly {
  constructor() {
    this.container = null;
  }

  /**
   * Mount Feature Interface to Root Element
   */
  async init(rootId) {
    this.container = document.getElementById(rootId);
    if (!this.container) return;

    this.renderSkeleton();
    this.attachEventListeners();
    await this.switchCategory(ASSET_CATEGORIES.ANIMATIONS);
  }

  /**
   * Render Base UI Skeleton
   */
  renderSkeleton() {
    this.container.innerHTML = `
      <div class="assets-hub-layout">
        <!-- Sidebar Navigation -->
        <aside class="assets-sidebar">
          <h3 class="sidebar-title">Asset & Inventory</h3>
          <ul class="category-nav-list">
            ${CATEGORY_PRESETS.map(cat => `
              <li class="nav-item-btn ${cat.id === ASSET_CATEGORIES.ANIMATIONS ? 'active' : ''}" data-category="${cat.id}">
                <span class="icon">${cat.icon}</span>
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
    document.querySelectorAll('.nav-item-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.category === categoryId);
    });

    const gridView = document.getElementById('asset-grid-view');
    gridView.innerHTML = `<div class="loading-spinner">Fetching ${categoryId}...</div>`;

    await assetsCoreInstance.fetchAssets(categoryId);
    this.renderGrid();
  }

  /**
   * Render Items Grid View
   */
  renderGrid() {
    const gridView = document.getElementById('asset-grid-view');
    const paginated = assetsCoreInstance.getPaginatedAssets();

    if (paginated.items.length === 0) {
      gridView.innerHTML = `<div class="empty-state">No assets found in this category.</div>`;
      return;
    }

    gridView.innerHTML = paginated.items.map(item => {
      const formatted = AssetsCategories.formatItemForPreview(item, assetsCoreInstance.selectedCategory);
      return `
        <div class="asset-card" data-id="${item.id}">
          <div class="card-preview">
            ${this.renderPreviewContent(formatted)}
          </div>
          <div class="card-info">
            <div class="card-title">${formatted.title}</div>
            <div class="card-subtext">${formatted.subText}</div>
          </div>
          <div class="card-actions">
            <button class="btn-sm btn-danger btn-delete-asset" data-id="${item.id}">Delete</button>
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * Render Item Preview Based on Asset Type
   */
  renderPreviewContent(formatted) {
    if (formatted.previewType === 'image') {
      return `<img src="${formatted.url}" alt="${formatted.title}" loading="lazy" />`;
    }
    if (formatted.previewType === 'audio') {
      return `<audio controls src="${formatted.url}"></audio>`;
    }
    if (formatted.previewType === 'text') {
      return `<div class="text-preview-box">${formatted.sample}</div>`;
    }
    if (formatted.previewType === 'colors') {
      return `
        <div class="palette-swatch-box">
          ${formatted.colors.map(c => `<span style="background-color: ${c}"></span>`).join('')}
        </div>
      `;
    }
    return `<div class="generic-preview">📦 ${formatted.previewType.toUpperCase()}</div>`;
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
        assetsCoreInstance.searchQuery = e.target.value;
        assetsCoreInstance.applyFilters();
        this.renderGrid();
      });
    }

    // Modal Events
    const openModalBtn = this.container.querySelector('#btn-open-upload-modal');
    const closeModalBtn = this.container.querySelector('#btn-close-modal');
    const modal = this.container.querySelector('#upload-modal');

    if (openModalBtn) openModalBtn.addEventListener('click', () => modal.classList.remove('hidden'));
    if (closeModalBtn) closeModalBtn.addEventListener('click', () => modal.classList.add('hidden'));
  }
}

export const assetsAssemblyInstance = new AssetsAssembly();
