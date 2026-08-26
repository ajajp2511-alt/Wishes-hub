/**
 * Create Wish Feature - Modular Entry Assembly
 * Path: admin/features/create-wish/create-wish-assembly.js
 */

import { WISH_CATEGORIES } from './create-wish-config.js';
import { createWishCoreInstance } from './create-wish-core.js';
import { CreateWishPreview } from './create-wish-preview.js';
import { renderAssemblyLayout } from './modules/assembly-ui-template.js';
import { bindAssemblyEvents } from './modules/assembly-event-manager.js';

import { TextWishModule } from './modules/text-wish-module.js';
import { ImageWishModule } from './modules/image-wish-module.js';
import { AudioWishModule } from './modules/audio-wish-module.js';
import { InteractiveWishModule } from './modules/interactive-wish-module.js';

const MODULE_REGISTRY = {
  'text': TextWishModule,
  'create-text': TextWishModule,
  'image': ImageWishModule,
  'create-image': ImageWishModule,
  'audio': AudioWishModule,
  'create-audio': AudioWishModule,
  'interactive': InteractiveWishModule,
  'create-interactive': InteractiveWishModule
};

export class CreateWishAssembly {
  constructor() {
    this.currentModule = null;
    this.previewInstance = null;
  }

  init(containerId = 'dynamic-content-root', subId = 'create-text') {
    const root = document.getElementById(containerId);
    if (!root) return;

    // 1. Render Base Layout
    renderAssemblyLayout(root);

    // 2. Initialize Preview Sandbox
    this.previewInstance = new CreateWishPreview('wish-staging-container');

    // 3. Sync Select Dropdown
    const select = document.getElementById('wish-category-select');
    if (select) select.value = subId;

    // 4. Load Target Module
    this.loadModule(subId);

    // 5. Attach Events
    bindAssemblyEvents({
      onCategoryChange: (newSubId) => this.loadModule(newSubId),
      onPreviewUpdate: (viewMode) => {
        if (viewMode) this.previewInstance.setViewMode(viewMode);
        this.triggerPreviewUpdate();
      }
    });
  }

  loadModule(subId) {
    const moduleContainer = document.getElementById('module-render-container');
    if (!moduleContainer) return;

    // Clear previous DOM
    moduleContainer.innerHTML = '';

    // Core State Reset
    const categoryKey = subId.replace('create-', '');
    const validCategory = WISH_CATEGORIES[categoryKey.toUpperCase()] || WISH_CATEGORIES.TEXT;
    createWishCoreInstance.setCategory(validCategory);

    // Mount Module
    const ModuleClass = MODULE_REGISTRY[subId] || TextWishModule;
    this.currentModule = new ModuleClass();
    this.currentModule.render(moduleContainer);

    // Bind Module Events
    this.currentModule.bindEvents((data) => {
      Object.keys(data).forEach((key) => createWishCoreInstance.updateFormField(key, data[key]));
      this.triggerPreviewUpdate();
    });

    this.triggerPreviewUpdate();
  }

  triggerPreviewUpdate() {
    if (this.previewInstance) {
      this.previewInstance.renderPreview(createWishCoreInstance.formData);
    }
  }
}

export const createWishAssemblyInstance = new CreateWishAssembly();

export function init(containerId = 'dynamic-content-root', subId = 'create-text') {
  createWishAssemblyInstance.init(containerId, subId);
}
