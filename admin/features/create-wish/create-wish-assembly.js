/**
 * Manage Wish Feature - Modular Entry Assembly
 * Path: admin/features/manage-wish/manage-wish-assembly.js
 */

import { manageWishCoreInstance } from './manage-wish-core.js';
import { renderManageWishLayout } from './modules/manage-wish-layout.js';

import { AllWishesModule } from './modules/all-wishes-module.js';
import { CategoriesWishModule } from './modules/categories-wish-module.js';
import { TemplatesWishModule } from './modules/templates-wish-module.js';

// MODULE REGISTRY (Exact create-wish wala pattern)
const MODULE_REGISTRY = {
  'wishes-all': AllWishesModule,
  'wishes-categories': CategoriesWishModule,
  'wishes-templates': TemplatesWishModule,
  'manage-wish': AllWishesModule
};

export class ManageWishAssembly {
  constructor() {
    this.currentModule = null;
  }

  init(containerId = 'outlet-root', payload = 'wishes-all') {
    // Router chahe object bhele ({ subId: 'wishes-all' }) ya direct string, subId extraction:
    const subId = typeof payload === 'object' && payload !== null 
      ? (payload.subId || payload.activeSubId || 'wishes-all') 
      : payload;

    const root = document.getElementById(containerId);
    if (!root) return;

    // 1. Render Base Layout (Navbar/Header controls if present)
    if (typeof renderManageWishLayout === 'function') {
      renderManageWishLayout(root);
    }

    // 2. Target Container me module load karein
    this.loadModule(subId, root);
  }

  loadModule(subId, rootElement) {
    const renderTarget = document.getElementById('manage-wish-render-container') || rootElement;

    // Clean Previous View
    renderTarget.innerHTML = '';

    // Core State Sync
    if (manageWishCoreInstance && typeof manageWishCoreInstance.setActiveTab === 'function') {
      manageWishCoreInstance.setActiveTab(subId);
    }

    // Dynamic Module Mounting
    const ModuleClass = MODULE_REGISTRY[subId] || AllWishesModule;
    this.currentModule = new ModuleClass();
    this.currentModule.render(renderTarget);

    // Bind Sub-Module Events
    if (typeof this.currentModule.bindEvents === 'function') {
      this.currentModule.bindEvents((data) => {
        if (manageWishCoreInstance && typeof manageWishCoreInstance.updateState === 'function') {
          manageWishCoreInstance.updateState(data);
        }
      });
    }
  }
}

export const manageWishAssemblyInstance = new ManageWishAssembly();

export function init(containerId = 'outlet-root', payload = 'wishes-all') {
  manageWishAssemblyInstance.init(containerId, payload);
}
