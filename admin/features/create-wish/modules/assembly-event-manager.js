/**
 * Create Wish Feature - Main Event Listener Orchestrator
 * Path: admin/features/create-wish/modules/assembly-event-manager.js
 */

import { createWishCoreInstance } from '../create-wish-core.js';
import { createWishAIInstance } from '../create-wish-ai.js';

export function bindAssemblyEvents({ onCategoryChange, onPreviewUpdate }) {
  // Category Dropdown Selection
  document.getElementById('wish-category-select')?.addEventListener('change', (e) => {
    onCategoryChange(e.target.value);
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
    const result = await createWishAIInstance.generateContent('Birthday', 'Emotional');
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
