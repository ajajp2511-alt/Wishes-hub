/**
 * Create Wish Feature - Modular Entry Assembly
 * Path: /admin/features/create-wish/create-wish-assembly.js
 */

import { createWishCoreInstance } from './create-wish-core.js';

// Sub-Modules Import (Exact Named Exports Match)
import { TextWishModule } from './modules/text-wish-module.js';
import { ImageWishModule } from './modules/image-wish-module.js';
import { AudioWishModule } from './modules/audio-wish-module.js';
import { InteractiveWishModule } from './modules/interactive-wish-module.js';

// MODULE REGISTRY
const MODULE_REGISTRY = {
  'create-text': TextWishModule,
  'create-image': ImageWishModule,
  'create-audio': AudioWishModule,
  'create-interactive': InteractiveWishModule,
  'create-wish': TextWishModule // Default Fallback
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

    return await this.loadModule(subId, root);
  }

  async loadModule(subId, rootElement) {
    const renderTarget = document.getElementById('create-wish-render-container') || rootElement;
    renderTarget.innerHTML = '';

    if (createWishCoreInstance && typeof createWishCoreInstance.setActiveTab === 'function') {
      createWishCoreInstance.setActiveTab(subId);
    }

    const ModuleClass = MODULE_REGISTRY[subId] || TextWishModule;
    
    if (!ModuleClass) {
      console.error(`❌ Class mapping missing for subId: ${subId}`);
      return false;
    }

    try {
      this.currentModule = new ModuleClass();
      
      // Module Rendering
      if (typeof this.currentModule.render === 'function') {
        await this.currentModule.render(renderTarget);
      }

      // Bind Sub-Module Events
      if (typeof this.currentModule.bindEvents === 'function') {
        this.currentModule.bindEvents((data) => {
          if (createWishCoreInstance && typeof createWishCoreInstance.updateState === 'function') {
            createWishCoreInstance.updateState(data);
          }
        });
      }

      return true; // Return true so Router safeRun passes!
    } catch (err) {
      console.error(`❌ Error mounting sub-module [${subId}]:`, err);
      return false;
    }
  }
}

export const createWishAssemblyInstance = new CreateWishAssembly();

// Router Entry Point
export async function init(containerId = 'dynamic-content-root', payload = 'create-text') {
  return await createWishAssemblyInstance.init(containerId, payload);
}

export default createWishAssemblyInstance;
