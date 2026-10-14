/**
 * Wishes Hub - Free Ad Templates & Assisted Editing Module
 * File: admin/features/ads/modules/ads-free-templates.js
 * Description: Fetches Google Sheets synced free starter templates catalog 
 *              and handles assisted edit text customization requests.
 */

import { ADS_CONFIG } from '../ads-config.js';

export class AdsFreeTemplates {
  constructor(coreInstance) {
    this.core = coreInstance;
    this.templateCache = [];
  }

  /**
   * Fetch Free Starter Ad Templates from Google Sheets Sync Endpoint or Local Fallback
   * @returns {Promise<Array>} List of Free Templates
   */
  async fetchFreeTemplates() {
    try {
      // Simulated fetch from Google Sheets Endpoint
      const mockSheetsData = [
        {
          templateId: 'FREE_AD_101',
          title: 'Local Retail Festival Starter Poster',
          category: 'Retail & Shopping',
          thumbnail: 'https://cdn.wishes-hub.com/templates/free_retail_101.jpg',
          editableFields: ['Shop Name', 'Offer Text', 'Phone Number']
        },
        {
          templateId: 'FREE_AD_102',
          title: 'Restaurant & Food Special Offer Banner',
          category: 'Food & Dining',
          thumbnail: 'https://cdn.wishes-hub.com/templates/free_food_102.jpg',
          editableFields: ['Restaurant Name', 'Dish Special', 'WhatsApp']
        },
        {
          templateId: 'FREE_AD_103',
          title: 'Coaching & Education Admission Banner',
          category: 'Education',
          thumbnail: 'https://cdn.wishes-hub.com/templates/free_edu_103.jpg',
          editableFields: ['Institute Name', 'Course Name', 'Contact']
        }
      ];

      this.templateCache = mockSheetsData;
      return mockSheetsData;
    } catch (e) {
      console.warn('[AdsFreeTemplates] Error syncing Google Sheets. Using fallback.', e);
      return [];
    }
  }

  /**
   * Render Free Template Catalog & Assisted Editing Panel UI
   * @param {HTMLElement} targetContainer 
   * @param {Function} onSelectTemplateCallback 
   */
  async renderCatalog(targetContainer, onSelectTemplateCallback) {
    const templates = await this.fetchFreeTemplates();

    targetContainer.innerHTML = `
      <div class="ads-free-catalog-wrap">
        <div class="ads-catalog-header">
          <h3>🎁 Free Starter Ad Templates Catalog</h3>
          <p>Choose a free template. You can edit it yourself or request our team to edit it for you!</p>
        </div>

        <div class="ads-templates-grid">
          ${templates.map(tpl => `
            <div class="ads-template-card" data-id="${tpl.templateId}">
              <img src="${tpl.thumbnail}" alt="${tpl.title}" class="ads-tpl-thumb" />
              <div class="ads-tpl-info">
                <h4>${tpl.title}</h4>
                <span class="ads-category-pill">${tpl.category}</span>
                <p>Fields: ${tpl.editableFields.join(', ')}</p>
                <button class="ads-btn-select-tpl" data-id="${tpl.templateId}">Select This Template</button>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Assisted Editing Instruction Form -->
        <div id="ads-assisted-edit-box" class="ads-assisted-box ads-hidden">
          <h4>Need Help Editing? (Assisted Edit Request)</h4>
          <p>Selected Template: <strong id="selected-tpl-name">-</strong></p>
          <div class="ads-input-group">
            <label for="ads-edit-instructions">Tell us what text/details to put in this template:</label>
            <textarea id="ads-edit-instructions" rows="3" placeholder="e.g., Put shop name as 'Patel Sweets', offer '10% off', WhatsApp '9876543210'"></textarea>
          </div>
          <button id="ads-confirm-assisted-btn" class="ads-btn-primary">Confirm & Attach to Request</button>
        </div>
      </div>
    `;

    this.bindCatalogEvents(targetContainer, templates, onSelectTemplateCallback);
  }

  /**
   * Bind Template Selection & Assisted Edit Event Handlers
   */
  bindCatalogEvents(container, templates, onSelectCallback) {
    let selectedTemplate = null;
    const assistedBox = container.querySelector('#ads-assisted-edit-box');
    const selectedTplName = container.querySelector('#selected-tpl-name');
    const confirmBtn = container.querySelector('#ads-confirm-assisted-btn');
    const instructionsInput = container.querySelector('#ads-edit-instructions');

    container.querySelectorAll('.ads-btn-select-tpl').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        selectedTemplate = templates.find(t => t.templateId === id);

        if (selectedTemplate) {
          selectedTplName.innerText = selectedTemplate.title;
          assistedBox.classList.remove('ads-hidden');
        </div>
      });
    });

    confirmBtn.addEventListener('click', () => {
      if (!selectedTemplate) return;

      const assistedDetails = {
        templateId: selectedTemplate.templateId,
        templateTitle: selectedTemplate.title,
        customInstructions: instructionsInput.value || 'No specific instructions provided.'
      };

      if (onSelectCallback) {
        onSelectCallback(assistedDetails);
      }

      alert('Free template details attached to your request!');
    });
  }
}
