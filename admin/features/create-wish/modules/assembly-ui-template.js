/**
 * Create Wish Feature - Base Layout Scaffolding Template
 * Path: admin/features/create-wish/modules/assembly-ui-template.js
 */

export function renderAssemblyLayout(container) {
  container.innerHTML = `
    <div class="create-wish-layout">
      <div class="form-section">
        <h2>Create New Wish</h2>
        
        <div class="form-group">
          <label>Title</label>
          <input type="text" id="input-title" placeholder="Enter Wish Title" />
        </div>

        <div class="form-group">
          <label>Category</label>
          <select id="wish-category-select">
            <option value="create-text">Text Wish</option>
            <option value="create-image">Image Wish</option>
            <option value="create-audio">Audio Wish</option>
            <option value="create-interactive">Interactive Wish</option>
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
