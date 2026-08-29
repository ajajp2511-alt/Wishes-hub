/**
 * Create Wish Feature - Modular Entry Assembly
 * Path: /admin/features/create-wish/create-wish-assembly.js
 */

import { createWishCoreInstance } from './create-wish-core.js';
import { renderCreateWishLayout } from './modules/assembly-ui-template.js'; // Check layout template name

// Sub-Modules Exact GitHub Path Imports
import { CreateTextWishModule } from './modules/text-wish-module.js';
import { CreateImageWishModule } from './modules/image-wish-module.js';
import { CreateAudioWishModule } from './modules/audio-wish-module.js';
import { CreateInteractiveWishModule } from './modules/interactive-wish-module.js';

// MODULE REGISTRY
const MODULE_REGISTRY = {
  'create-text': CreateTextWishModule,
  'create-image': CreateImageWishModule,
  'create-audio': CreateAudioWishModule,
  'create-interactive': CreateInteractiveWishModule,
  'create-wish': CreateTextWishModule // Fallback
};

export class CreateWishAssembly {
  constructor() {
    this.currentModule = null;
  }

  async init(containerId = 'dynamic-content-root', payload = 'create-text') {
    const subId = typeof payload === 'object' && payload !== null 
      ? (payload.subId || payload.activeSubId || 'create-text') 
      : payload;

    const root = document.getElementById(containerId);
    if (!root) return false;

    // Base Layout Render
    if (typeof renderCreateWishLayout === 'function') {
      try {
        await renderCreateWishLayout(root);
      } catch (e) {
        console.warn('Layout render warning:', e);
      }
    }

    // Load Sub Module
    return await this.loadModule(subId, root);
  }

  async loadModule(subId, rootElement) {
    const renderTarget = document.getElementById('create-wish-render-container') || rootElement;
    renderTarget.innerHTML = '';

    if (createWishCoreInstance && typeof createWishCoreInstance.setActiveTab === 'function') {
      createWishCoreInstance.setActiveTab(subId);
    }

    const ModuleClass = MODULE_REGISTRY[subId] || CreateTextWishModule;
    
    if (!ModuleClass) {
      console.error(`Module class missing for subId: ${subId}`);
      return false;
    }

    try {
      this.currentModule = new ModuleClass();
      
      if (typeof this.currentModule.render === 'function') {
        await this.currentModule.render(renderTarget);
      } else {
        renderTarget.innerHTML = `<div style="padding: 20px;"><h2>Module Ready: ${subId}</h2></div>`;
      }

      if (typeof this.currentModule.bindEvents === 'function') {
        this.currentModule.bindEvents((data) => {
          if (createWishCoreInstance && typeof createWishCoreInstance.updateState === 'function') {
            createWishCoreInstance.updateState(data);
          }
        });
      }

      return true; // Execution successful!
    } catch (err) {
      console.error(`Error mounting module [${subId}]:`, err);
      return false;
    }
  }
}

export const createWishAssemblyInstance = new CreateWishAssembly();

export async function init(containerId = 'dynamic-content-root', payload = 'create-text') {
  return await createWishAssemblyInstance.init(containerId, payload);
}

export default createWishAssemblyInstance;
