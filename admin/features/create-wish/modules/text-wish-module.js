/**
 * Create Wish Feature - Text Wish Sub-Module
 * Path: admin/features/create-wish/modules/text-wish-module.js
 */

export class TextWishModule {
  render(container) {
    container.innerHTML = `
      <div class="form-group">
        <label>Message Content</label>
        <textarea id="input-content" rows="4" placeholder="Type your wish message..."></textarea>
      </div>
    `;
  }

  bindEvents(onUpdate) {
    document.getElementById('input-content')?.addEventListener('input', (e) => {
      onUpdate({ Content: e.target.value });
    });
  }
}
