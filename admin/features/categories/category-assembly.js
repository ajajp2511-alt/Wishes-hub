import { CategoryCore } from './category-core.js';
import { CategoryUI } from './category-ui.js';
import { handleAddCategory } from './modules/add-category.js';
import { handleDeleteCategory } from './modules/delete-category.js';
import { handleSearchAndFilter } from './modules/filter-category.js';

const core = new CategoryCore();

const handlers = {
    onAdd: (e) => handleAddCategory(core, ui, e),
    onSearch: () => handleSearchAndFilter(core, ui)
};

const ui = new CategoryUI(core, handlers);

// Expose handlers globally for template event bindings
window.switchMainTab = (type) => ui.render(type);
window.openModal = () => ui.openModal();
window.closeModal = () => ui.closeModal();
window.deleteCat = (id) => handleDeleteCategory(core, ui, id);
window.toggleCatStatus = (id) => {
    core.toggleStatus(id);
    ui.render(core.activeTab);
};

// Assembly Initialization on DOM Load
document.addEventListener('DOMContentLoaded', () => {
    ui.init();
});
