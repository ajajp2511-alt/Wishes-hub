/**
 * Create Wish Feature - Base Layout Scaffolding Template
 * Path: admin/features/create-wish/modules/assembly-ui-template.js
 */

import { categoriesConfig } from '../category-data.js';

export function renderAssemblyLayout(container) {
  const categoryKeys = Object.keys(categoriesConfig);
  const firstCategory = categoryKeys[0];
  const firstSubCategories = categoriesConfig[firstCategory] || [];

  container.innerHTML = `
    <div class="create-wish-layout">
      <div class="form-section">
        <h2>Create New Wish</h2>
        
        <div class="form-group">
          <label>Title</label>
          <input type="text" id="input-title" placeholder="Enter Wish Title" />
        </div>

        <div class="form-group">
          <label>Wish Format / Type</label>
          <select id="wish-format-type-select">
            <option value="create-text">Text Wish</option>
            <option value="create-image">Image Wish</option>
            <option value="create-audio">Audio Wish</option>
            <option value="create-interactive">Interactive Wish</option>
          </select>
        </div>

        <div class="form-group">
          <label>Occasion / Category</label>
          <select id="wish-main-category-select">
            ${categoryKeys.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
          </select>
        </div>

        <div class="form-group">
          <label>Sub-Category / Target Audience</label>
          <select id="wish-sub-category-select">
            ${firstSubCategories.map(sub => `<option value="${sub}">${sub}</option>`).join('')}
          </select>
        </div>

        <!-- Dynamic Active Sub-Module Slot -->
        <div id="module-render-container"></div>

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
}
