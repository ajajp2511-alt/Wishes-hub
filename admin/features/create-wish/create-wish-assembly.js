/**
 * Create Wish Feature - Modular Entry Assembly
 * Path: /admin/features/create-wish/create-wish-assembly.js
 */

import { createWishCoreInstance } from './create-wish-core.js';
import { renderCreateWishLayout } from './modules/create-wish-layout.js';

// Sub-Modules Import
import { CreateTextWishModule } from './modules/create-text-wish-module.js';
import { CreateImageWishModule } from './modules/create-image-wish-module.js';
import { CreateAudioWishModule } from './modules/create-audio-wish-module.js';
import { CreateVideoWishModule } from './modules/create-video-wish-module.js';
import { CreateStoryWishModule } from './modules/create-story-wish-module.js';
import { CreateInteractiveWishModule } from './modules/create-interactive-wish-module.js';
import { CreateAiWishModule } from './modules/create-ai-wish-module.js';

// MODULE REGISTRY (Router subId to Module Class mapping)
const MODULE_REGISTRY = {
  'create-text': CreateTextWishModule,
  'create-image': CreateImageWishModule,
  'create-audio': CreateAudioWishModule,
  'create-video': CreateVideoWishModule,
  'create-story': CreateStoryWishModule,
  'create-interactive': CreateInteractiveWishModule,
  'create-ai': CreateAiWishModule,
  'create-wish': CreateTextWishModule // Fallback / Default
};

export class CreateWishAssembly {
  constructor() {
    this.currentModule = null;
  }

  init(containerId = 'dynamic-content-root', payload = 'create-text') {
    // SubId Extraction (Supports both String and Object payload from router)
    const subId = typeof payload === 'object' && payload !== null 
      ? (payload.subId || payload.activeSubId || 'create-text') 
      : payload;

    const root = document.getElementById(containerId);
    if (!root) return;

    // 1. Render Base Layout (Navbar/Header controls for Create Wish section)
    if (typeof renderCreateWishLayout === 'function') {
      renderCreateWishLayout(root);
    }

    // 2. Specific Sub-module mount karein
    this.loadModule(subId, root);
  }

  loadModule(subId, rootElement) {
    const renderTarget = document.getElementById('create-wish-render-container') || rootElement;

    // Clear previous sub-view
    renderTarget.innerHTML = '';

    // Core State Sync
    if (createWishCoreInstance && typeof createWishCoreInstance.setActiveTab === 'function') {
      createWishCoreInstance.setActiveTab(subId);
    }

    // Dynamic Module Instantiation
    const ModuleClass = MODULE_REGISTRY[subId] || CreateTextWishModule;
    this.currentModule = new ModuleClass();
    
    // Render selected sub-feature view
    if (typeof this.currentModule.render === 'function') {
      this.currentModule.render(renderTarget);
    }

    // Bind Sub-Module Events
    if (typeof this.currentModule.bindEvents === 'function') {
      this.currentModule.bindEvents((data) => {
        if (createWishCoreInstance && typeof createWishCoreInstance.updateState === 'function') {
          createWishCoreInstance.updateState(data);
        }
      });
    }
  }
}

export const createWishAssemblyInstance = new CreateWishAssembly();

// Universal Smart Router Entry Point
export function init(containerId = 'dynamic-content-root', payload = 'create-text') {
  createWishAssemblyInstance.init(containerId, payload);
}
