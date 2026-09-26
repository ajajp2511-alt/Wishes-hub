/**
 * Create Wish Feature - Text Wish Sub-Module (Class-Based Edition)
 * Path: admin/features/create-wish/modules/text-wish-module.js
 */

export class TextWishModule {
  render(container) {
    container.innerHTML = `
      <div class="form-section">
        <h2>Create Message</h2>
        
        <!-- Wish Title Field -->
        <div class="form-group" style="margin-bottom: 16px;">
          <label for="input-title">Wish Title / Heading</label>
          <input type="text" id="input-title" placeholder="e.g., Happy Birthday Dost! 🎉" style="width: 100%; padding: 10px; font-size: 0.95rem; border: 1px solid #cbd5e1; border-radius: 6px;" />
        </div>

        <!-- Category Selector -->
        <div class="form-group" style="margin-bottom: 16px;">
          <label for="input-category">Category</label>
          <select id="input-category" style="width: 100%; padding: 10px; font-size: 0.95rem; border: 1px solid #cbd5e1; border-radius: 6px;">
            <option value="birthday">🎂 Birthday</option>
            <option value="anniversary">❤️ Anniversary</option>
            <option value="festival">🎆 Festival / New Year</option>
            <option value="friendship">🤝 Friendship</option>
            <option value="morning">🌅 Good Morning / Night</option>
            <option value="general">✨ General / Other</option>
          </select>
        </div>

        <!-- Author / Sender Name Field -->
        <div class="form-group" style="margin-bottom: 16px;">
          <label for="input-author">Author / Sender Name</label>
          <input type="text" id="input-author" placeholder="e.g., Patel Studio or Your Name" style="width: 100%; padding: 10px; font-size: 0.95rem; border: 1px solid #cbd5e1; border-radius: 6px;" />
        </div>

        <div class="form-group">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <label for="input-content">Message Content</label>
            <span id="char-counter" style="font-size: 0.8rem; color: #64748b;">0 / 500 chars</span>
          </div>

          <!-- Formatting Toolbar -->
          <div class="text-toolbar" style="display: flex; gap: 6px; margin-bottom: 4px; flex-wrap: wrap; align-items: center;">
            <button type="button" class="btn-secondary toolbar-btn" data-action="bold" title="Bold" style="padding: 6px 12px; font-size: 0.8rem;"><b>B</b></button>
            <button type="button" class="btn-secondary toolbar-btn" data-action="italic" title="Italic" style="padding: 6px 12px; font-size: 0.8rem;"><i>I</i></button>
            
            <select id="text-font-style" style="width: auto; padding: 6px 10px; font-size: 0.85rem;">
              <option value="sans-serif">Default Font</option>
              <option value="cursive">Handwriting Style</option>
              <option value="serif">Classic Serif</option>
            </select>

            <select id="preset-wishes" style="width: auto; padding: 6px 10px; font-size: 0.85rem; margin-left: auto;">
              <option value="">✨ Quick Templates</option>
              <option value="Wishing you a day filled with happiness and a year filled with joy. Happy Birthday! 🎉">Birthday Wish</option>
              <option value="May the magic of this special day bring you endless peace and love. Happy Anniversary! ❤️">Anniversary Wish</option>
              <option value="Wishing you a prosperous, healthy, and joyous New Year ahead! 🌟">New Year Wish</option>
            </select>
          </div>

          <textarea id="input-content" rows="5" maxlength="500" placeholder="Type your heartfelt wish message here... (Use device emoji keyboard 😊)"></textarea>
        </div>
      </div>
    `;
  }

  bindEvents(onUpdate) {
    const titleInput = document.getElementById('input-title');
    const categorySelect = document.getElementById('input-category');
    const authorInput = document.getElementById('input-author');
    const textarea = document.getElementById('input-content');
    const charCounter = document.getElementById('char-counter');
    const presetSelect = document.getElementById('preset-wishes');
    const fontSelect = document.getElementById('text-font-style');

    // Title Event
    titleInput?.addEventListener('input', (e) => {
      onUpdate({ Title: e.target.value.trim() });
    });

    // Category Event
    categorySelect?.addEventListener('change', (e) => {
      onUpdate({ Category: e.target.value });
    });

    // Author Event
    authorInput?.addEventListener('input', (e) => {
      onUpdate({ Author: e.target.value.trim() });
    });

    // Content Textarea Event
    textarea?.addEventListener('input', (e) => {
      const text = e.target.value;
      if (charCounter) {
        charCounter.textContent = `${text.length} / 500 chars`;
      }
      onUpdate({ Content: text.trim() });
    });

    fontSelect?.addEventListener('change', (e) => {
      const font = e.target.value;
      if (font === 'cursive') {
        textarea.style.fontFamily = 'cursive, sans-serif';
      } else if (font === 'serif') {
        textarea.style.fontFamily = 'Georgia, serif';
      } else {
        textarea.style.fontFamily = 'inherit';
      }
      onUpdate({ FontStyle: font });
    });

    presetSelect?.addEventListener('change', (e) => {
      const selectedText = e.target.value;
      if (selectedText && textarea) {
        textarea.value = selectedText;
        textarea.dispatchEvent(new Event('input'));
      }
    });

    document.querySelectorAll('.text-toolbar .toolbar-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.getAttribute('data-action');
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value.substring(start, end);

        let replacement = '';
        if (action === 'bold') {
          replacement = `**${selectedText || 'Bold Text'}**`;
        } else if (action === 'italic') {
          replacement = `*${selectedText || 'Italic Text'}*`;
        }

        textarea.value = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
        textarea.focus();
        textarea.dispatchEvent(new Event('input'));
      });
    });
  }
}
