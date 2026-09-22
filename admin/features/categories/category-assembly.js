/**
 * Categories Assembly Controller (With HTML Shell Rendering)
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

    // Pehle container ke andar required HTML shell inject karein taaki elements null na aayein
    container.innerHTML = `
      <div class="p-6 max-w-7xl mx-auto">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-800">Categories Management</h1>
            <p id="sectionInfo" class="text-sm text-gray-500">Showing all categories under Wishes</p>
          </div>
          <button onclick="window.openModal()" class="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
            <i class="fa-solid fa-plus mr-2"></i> Add Category
          </button>
        </div>

        <div class="flex space-x-6 border-b border-gray-200 mb-6">
          <button id="main-tab-wishes" onclick="window.switchMainTab('Wishes')" class="pb-3 font-semibold text-indigo-600 border-b-2 border-indigo-600 transition flex items-center">Wishes</button>
          <button id="main-tab-shayari" onclick="window.switchMainTab('Shayari')" class="pb-3 font-semibold text-gray-500 border-b-2 border-transparent hover:text-gray-700 transition flex items-center">Shayari</button>
        </div>

        <div class="mb-4">
          <input type="text" id="searchCategory" placeholder="Search categories..." class="w-full md:w-80 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th class="py-3 px-6">Icon</th>
                <th class="py-3 px-6">Name</th>
                <th class="py-3 px-6">Slug</th>
                <th class="py-3 px-6">Items Count</th>
                <th class="py-3 px-6">Status</th>
                <th class="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody id="categoryTableBody" class="divide-y divide-gray-200">
              <!-- Dynamically populated -->
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal Placeholder -->
      <div id="categoryModal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50">
        <div class="bg-white rounded-xl p-6 w-full max-w-md">
          <h3 class="text-lg font-bold mb-4">Add New Category</h3>
          <form id="categoryForm">
            <input type="hidden" id="modalCatType">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
              <input type="text" id="catNameInput" required class="w-full px-3 py-2 border rounded-lg text-sm">
            </div>
            <div class="flex justify-end space-x-3">
              <button type="button" onclick="window.closeModal()" class="px-4 py-2 text-gray-600 text-sm">Cancel</button>
              <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm">Save</button>
            </div>
          </form>
        </div>
      </div>
    `;

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

    ui.init();
  }
};

export default CategoriesAssembly;
