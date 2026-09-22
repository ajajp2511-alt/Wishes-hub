/**
 * Categories Assembly Controller (Defensive Guard)
 * Path: admin/features/categories/categories-assembly.js
 */

import { CategoryCore } from './category-core.js';
import { CategoryUI } from './category-ui.js';
import { handleAddCategory } from './modules/add-category.js';
import { handleDeleteCategory } from './modules/delete-category.js';
import { handleSearchAndFilter } from './modules/filter-category.js';

export const CategoriesAssembly = {
  init(rootId) {
    const container = document.getElementById(rootId);
    if (!container) {
      console.error(`Root container with ID "${rootId}" not found.`);
      return;
    }

    const core = new CategoryCore();
    let ui = null;

    const handlers = {
      onAdd: (e) => handleAddCategory(core, ui, e),
      onSearch: () => handleSearchAndFilter(core, ui)
    };

    ui = new CategoryUI(core, handlers);

    window.switchMainTab = (type) => ui.render(type);
    window.openModal = () => ui.openModal();
    window.closeModal = () => ui.closeModal();
    window.deleteCat = (id) => handleDeleteCategory(core, ui, id);
    window.toggleCatStatus = (id) => {
      core.toggleStatus(id);
      ui.render(core.activeTab);
    };

    if (typeof ui.init === 'function') {
      ui.init(rootId);
    } else {
      ui.render();
    }
  }
};

export default CategoriesAssembly;
