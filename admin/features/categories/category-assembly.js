/**
 * Categories Assembly Controller (Fixed Scope)
 * Path: admin/features/categories/categories-assembly.js
 */

import { CategoryCore } from './category-core.js';
import { CategoryUI } from './category-ui.js';
import { handleAddCategory } from './modules/add-category.js';
import { handleDeleteCategory } from './modules/delete-category.js';
import { handleSearchAndFilter } from './modules/filter-category.js';

export const CategoriesAssembly = {
  init(rootId) {
    const core = new CategoryCore();
    
    // Pehle UI instance banayein taaki handlers ke andar 'ui' variable defined rahe
    let ui = null;

    const handlers = {
      onAdd: (e) => handleAddCategory(core, ui, e),
      onSearch: () => handleSearchAndFilter(core, ui)
    };

    ui = new CategoryUI(core, handlers);

    // Expose handlers globally for template event bindings
    window.switchMainTab = (type) => ui.render(type);
    window.openModal = () => ui.openModal();
    window.closeModal = () => ui.closeModal();
    window.deleteCat = (id) => handleDeleteCategory(core, ui, id);
    window.toggleCatStatus = (id) => {
      core.toggleStatus(id);
      ui.render(core.activeTab);
    };

    // Safe initialization with root container check
    if (typeof ui.init === 'function') {
      ui.init(rootId);
    } else {
      const container = document.getElementById(rootId);
      if (container) {
        ui.render();
      }
    }
  }
};

export default CategoriesAssembly;
