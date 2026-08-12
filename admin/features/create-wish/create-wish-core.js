/**
 * Create Wish Feature - Core Engine & Submit Handlers
 * Path: admin/features/create-wish/create-wish-core.js
 */

import { WISH_CATEGORIES, SHEET_CONFIG, CATEGORY_SCHEMAS } from './create-wish-config.js';

export class CreateWishCore {
  constructor() {
    this.currentCategory = WISH_CATEGORIES.TEXT;
    this.formData = {};
    this.isSubmitting = false;
  }

  /**
   * Category change listener & Reset Form Schema
   */
  setCategory(category) {
    if (!Object.values(WISH_CATEGORIES).includes(category)) {
      throw new Error(`Invalid Wish Category: ${category}`);
    }
    this.currentCategory = category;
    this.formData = { category: category };
    console.log(`[CreateWishCore] Category switched to: ${category}`);
    return CATEGORY_SCHEMAS[category];
  }

  /**
   * Handle Dynamic Field Inputs
   */
  updateFormField(fieldName, value) {
    this.formData[fieldName] = value;
  }

  /**
   * Form Validation Engine
   */
  validateForm() {
    const requiredSchema = CATEGORY_SCHEMAS[this.currentCategory];
    const missingFields = [];

    // Basic required check for Title
    if (!this.formData.Title || this.formData.Title.trim() === '') {
      missingFields.push('Title');
    }

    // Category-specific validations
    if (this.currentCategory === WISH_CATEGORIES.TEXT && !this.formData.Content) {
      missingFields.push('Content');
    } else if (this.currentCategory === WISH_CATEGORIES.IMAGE && !this.formData.Image_CDN_URL) {
      missingFields.push('Image_CDN_URL');
    } else if (this.currentCategory === WISH_CATEGORIES.AUDIO && !this.formData.Audio_CDN_URL) {
      missingFields.push('Audio_CDN_URL');
    }

    return {
      isValid: missingFields.length === 0,
      missingFields
    };
  }

  /**
   * Generate Payload & Submit Wish to Backend Sheet Proxy
   */
  async submitWish(customSheetId = null) {
    const validation = this.validateForm();
    if (!validation.isValid) {
      return {
        success: false,
        message: `Missing required fields: ${validation.missingFields.join(', ')}`
      };
    }

    this.isSubmitting = true;

    // Determine target sheet ID
    const targetSheetId = customSheetId || SHEET_CONFIG.categorySheets[this.currentCategory];

    const wishId = `WISH_${Date.now()}`;
    const payload = {
      wishId,
      category: this.currentCategory,
      targetSheetId,
      data: {
        ...this.formData,
        Wish_ID: wishId,
        Status: this.formData.Scheduled_At ? 'Scheduled' : 'Active',
        Created_At: new Date().toISOString()
      }
    };

    try {
      // Backend Serverless Function API Call
      const response = await fetch('/api/sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      this.isSubmitting = false;

      if (response.ok) {
        return { success: true, wishId, data: result };
      } else {
        return { success: false, message: result.error || 'Failed to create wish.' };
      }
    } catch (error) {
      this.isSubmitting = false;
      return { success: false, message: error.message };
    }
  }
}

export const createWishCoreInstance = new CreateWishCore();
