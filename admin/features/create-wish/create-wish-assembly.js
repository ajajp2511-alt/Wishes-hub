/**
 * Create Wish Feature - Main Assembly & UI Integrator
 * Path: admin/features/create-wish/create-wish-assembly.js
 */

import { WISH_CATEGORIES, CATEGORY_SCHEMAS } from './create-wish-config.js';
import { createWishCoreInstance } from './create-wish-core.js';
import { createWishAIInstance } from './create-wish-ai.js';
import { CreateWishPreview } from './create-wish-preview.js';
import { createWishInteractiveInstance } from './create-wish-interactive.js';
import { createWishAudioInstance } from './create-wish-audio.js';
import { createWishCDNInstance } from './create-wish-cdn.js';

// SubId to Wish Category Mapping Matrix
const SUBID_TO_CATEGORY_MAP = {
  'create-text': WISH_CATEGORIES.TEXT || 'text',
  'create-image': WISH_CATEGORIES.IMAGE || 'image',
  'create-audio': WISH_CATEGORIES.AUDIO || 'audio',
  'create-video': WISH_CATEGORIES.VIDEO || 'video',
  'create-story': WISH_CATEGORIES.STORY || 'story',
  'create-interactive': WISH_CATEGORIES.INTERACTIVE || 'interactive',
  'create-ai': WISH_CATEGORIES.AI || 'ai'
};

export class CreateWishAssembly {
  constructor() {
    this.previewInstance = null;
    this.elements = {};
  }

  /**
   * Initialize and Bind All UI Elements
   * @param {string} containerId 
   * @param {string} subId - Router se aane wala sub-menu ID (e.g. 'create-image', 'create-audio')
   */
  init(containerId = 'create-wish-module-root', subId = 'create-text') {
    const root = document.getElementById(containerId);
    if (!root) {
      console.error(`[CreateWishAssembly] Root element #${containerId} not found.`);
      return;
    }

    // Dynamic Category Detection based on subId
    const targetCategory = SUBID_TO_CATEGORY_MAP[subId] || WISH_CATEGORIES.TEXT;

    // Render Basic Layout Structure
    root.innerHTML = `
      <div class="create-wish-layout">
        <div class="form-section">
          <h2>Create New Wish (${targetCategory.toUpperCase()})</h2>
          
          <div class="form-group">
            <label>Category</label>
            <select id="wish-category-select">
              ${Object.values(WISH_CATEGORIES).map(cat => 
                `<option value="${cat}" ${cat === targetCategory ? 'selected' : ''}>${cat.toUpperCase()}</option>`
              ).join('')}
            </select>
          </div>

          <div id="dynamic-fields-container"></div>

          <div class="form-actions">
            <button id="btn-ai-generate" type="button" class="btn-secondary">✨ AI Generate</button>
            <button id="btn-submit-wish" type="button" class="btn-primary">Save & Publish</button>
          </div>
        </div>

        <div class="preview-section">
          <div class="view-toggle">
            <button id="btn-mode-mobile" class="active">Mobile</button>
            <button id="btn-mode-desktop">Desktop</button>
          </div>
          <div id="wish-staging-container"></div>
        </div>
      </div>
    `;

    // Initialize Preview Engine
    this.previewInstance = new CreateWishPreview('wish-staging-container');

    // Bind Event Listeners
    this.bindEvents();
    
    // Target Category Render
    this.renderCategoryFields(targetCategory);
  }

  /**
   * Render dynamic fields based on selected category
   */
  renderCategoryFields(category) {
    const schema = createWishCoreInstance.setCategory(category);
    const container = document.getElementById('dynamic-fields-container');
    if (!container) return;

    let html = `
      <div class="form-group">
        <label>Title</label>
        <input type="text" id="input-title" placeholder="Enter Wish Title" />
      </div>
    `;

    if (category === WISH_CATEGORIES.TEXT || category === WISH_CATEGORIES.AI) {
      html += `
        <div class="form-group">
          <label>Message Content</label>
          <textarea id="input-content" rows="4" placeholder="Type your wish message..."></textarea>
        </div>
      `;
    }

    if (category === WISH_CATEGORIES.IMAGE) {
      html += `
        <div class="form-group">
          <label>Upload Image</label>
          <input type="file" id="input-image-file" accept="image/*" />
        </div>
      `;
    }

    if (category === WISH_CATEGORIES.AUDIO) {
      html += `
        <div class="form-group">
          <label>Upload Audio File (.mp3)</label>
          <input type="file" id="input-audio-file" accept="audio/*" />
        </div>
        <div class="form-group">
          <label>Audio Overlay Text</label>
          <textarea id="input-content" rows="2" placeholder="Optional text with audio..."></textarea>
        </div>
      `;
    }

    container.innerHTML = html;
    this.attachFieldListeners();
  }

  /**
   * Event Listeners Setup
   */
  bindEvents() {
    // Category Select
    const select = document.getElementById('wish-category-select');
    if (select) {
      select.addEventListener('change', (e) => {
        this.renderCategoryFields(e.target.value);
      });
    }

    // View Mode Toggles
    document.getElementById('btn-mode-mobile')?.addEventListener('click', () => {
      this.previewInstance.setViewMode('mobile');
      this.triggerPreviewUpdate();
    });

    document.getElementById('btn-mode-desktop')?.addEventListener('click', () => {
      this.previewInstance.setViewMode('desktop');
      this.triggerPreviewUpdate();
    });

    // AI Generate Action
    document.getElementById('btn-ai-generate')?.addEventListener('click', async () => {
      const result = await createWishAIInstance.generateContent('Birthday', 'Emotional');
      if (result.success) {
        const titleInput = document.getElementById('input-title');
        const contentInput = document.getElementById('input-content');
        if (titleInput) titleInput.value = result.generatedTitle;
        if (contentInput) contentInput.value = result.generatedContent;
        
        createWishCoreInstance.updateFormField('Title', result.generatedTitle);
        createWishCoreInstance.updateFormField('Content', result.generatedContent);
        this.triggerPreviewUpdate();
      }
    });

    // Submit Action
    document.getElementById('btn-submit-wish')?.addEventListener('click', async () => {
      const res = await createWishCoreInstance.submitWish();
      alert(res.success ? `Wish Created! ID: ${res.wishId}` : `Error: ${res.message}`);
    });
  }

  /**
   * Field input synchronization
   */
  attachFieldListeners() {
    const titleInput = document.getElementById('input-title');
    const contentInput = document.getElementById('input-content');
    const imageInput = document.getElementById('input-image-file');

    titleInput?.addEventListener('input', (e) => {
      createWishCoreInstance.updateFormField('Title', e.target.value);
      this.triggerPreviewUpdate();
    });

    contentInput?.addEventListener('input', (e) => {
      createWishCoreInstance.updateFormField('Content', e.target.value);
      this.triggerPreviewUpdate();
    });

    imageInput?.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (file) {
        const uploadRes = await createWishCDNInstance.uploadMedia(file);
        if (uploadRes.success) {
          createWishCoreInstance.updateFormField('Image_CDN_URL', uploadRes.cdnUrl);
          this.triggerPreviewUpdate();
        }
      }
    });
  }

  triggerPreviewUpdate() {
    if (this.previewInstance) {
      this.previewInstance.renderPreview(createWishCoreInstance.formData);
    }
  }
}

export const createWishAssemblyInstance = new CreateWishAssembly();

// Router Integration Export Function
export function init(containerId = 'dynamic-content-root', subId = 'create-text') {
  createWishAssemblyInstance.init(containerId, subId);
                            }
