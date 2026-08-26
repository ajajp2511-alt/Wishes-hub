/**
 * Create Wish Feature - Image Wish Sub-Module
 * Path: admin/features/create-wish/modules/image-wish-module.js
 */

import { createWishCDNInstance } from '../create-wish-cdn.js';

export class ImageWishModule {
  render(container) {
    container.innerHTML = `
      <div class="form-group">
        <label>Upload Image</label>
        <input type="file" id="input-image-file" accept="image/*" />
      </div>
      <div class="form-group">
        <label>Image Caption / Overlay Text</label>
        <textarea id="input-content" rows="2" placeholder="Enter image caption..."></textarea>
      </div>
    `;
  }

  bindEvents(onUpdate) {
    document.getElementById('input-content')?.addEventListener('input', (e) => {
      onUpdate({ Content: e.target.value });
    });

    document.getElementById('input-image-file')?.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (file && createWishCDNInstance) {
        const res = await createWishCDNInstance.uploadMedia(file);
        if (res.success) {
          onUpdate({ Image_CDN_URL: res.cdnUrl });
        }
      }
    });
  }
}
