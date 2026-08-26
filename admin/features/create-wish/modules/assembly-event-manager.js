/**
 * Create Wish Feature - Main Event Listener Orchestrator
 * Path: admin/features/create-wish/modules/assembly-event-manager.js
 */

import { createWishCoreInstance } from '../create-wish-core.js';
import { createWishAIInstance } from '../create-wish-ai.js';
import { categoriesConfig } from '../category-data.js';

export function bindAssemblyEvents({ onCategoryChange, onPreviewUpdate }) {
  // Format Type Switcher (Text, Image, Audio, Interactive)
  document.getElementById('wish-format-type-select')?.addEventListener('change', (e) => {
    onCategoryChange(e.target.value);
  });

  // Main Category Dynamic Selector
  document.getElementById('wish-main-category-select')?.addEventListener('change', (e) => {
    const selectedMainCat = e.target.value;
    createWishCoreInstance.updateFormField('MainCategory', selectedMainCat);
    
    // Update Sub-category Dropdown Options
    const subCatSelect = document.getElementById('wish-sub-category-select');
    if (subCatSelect) {
      const subCategories = categoriesConfig[selectedMainCat] || [];
      subCatSelect.innerHTML = subCategories.map(sub => `<option value="${sub}">${sub}</option>`).join('');
      if (subCategories.length > 0) {
        createWishCoreInstance.updateFormField('SubCategory', subCategories[0]);
      }
    }
  });

  // Sub-Category Selector
  document.getElementById('wish-sub-category-select')?.addEventListener('change', (e) => {
    createWishCoreInstance.updateFormField('SubCategory', e.target.value);
  });

  // Title Live Sync
  document.getElementById('input-title')?.addEventListener('input', (e) => {
    createWishCoreInstance.updateFormField('Title', e.target.value);
    onPreviewUpdate();
  });

  // Viewport Toggles (Mobile / Desktop)
  document.getElementById('btn-mode-mobile')?.addEventListener('click', (e) => {
    document.getElementById('btn-mode-desktop')?.classList.remove('active');
    e.target.classList.add('active');
    onPreviewUpdate('mobile');
  });

  document.getElementById('btn-mode-desktop')?.addEventListener('click', (e) => {
    document.getElementById('btn-mode-mobile')?.classList.remove('active');
    e.target.classList.add('active');
    onPreviewUpdate('desktop');
  });

  // AI Content Generator Action
  document.getElementById('btn-ai-generate')?.addEventListener('click', async () => {
    const mainCat = document.getElementById('wish-main-category-select')?.value || 'Birthday';
    const subCat = document.getElementById('wish-sub-category-select')?.value || 'Friend';
    
    const result = await createWishAIInstance.generateContent(mainCat, subCat);
    if (result.success) {
      const titleInput = document.getElementById('input-title');
      const contentInput = document.getElementById('input-content');

      if (titleInput) titleInput.value = result.generatedTitle;
      if (contentInput) contentInput.value = result.generatedContent;

      createWishCoreInstance.updateFormField('Title', result.generatedTitle);
      createWishCoreInstance.updateFormField('Content', result.generatedContent);
      onPreviewUpdate();
    }
  });

  // Wish Submit Action
  document.getElementById('btn-submit-wish')?.addEventListener('click', async () => {
    const res = await createWishCoreInstance.submitWish();
    alert(res.success ? `Wish Created! ID: ${res.wishId}` : `Error: ${res.message}`);
  });
}
