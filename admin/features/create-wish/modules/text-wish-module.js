/**
 * Create Wish Feature - Text Wish Sub-Module (Professional Edition)
 * Path: admin/features/create-wish/modules/text-wish-module.js
 */

export class TextWishModule {
  render(container) {
    container.innerHTML = `
      <div class="form-group text-wish-container">
        <div class="label-wrapper" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <label for="input-content" style="font-weight: 600;">Message Content</label>
          <span id="char-counter" style="font-size: 12px; color: var(--text-muted, #777);">0 / 500 chars</span>
        </div>

        <!-- Quick Formatting & Templates Toolbar -->
        <div class="text-toolbar" style="display: flex; gap: 8px; margin-bottom: 8px; flex-wrap: wrap;">
          <button type="button" class="toolbar-btn" data-action="bold" title="Bold"><b>B</b></button>
          <button type="button" class="toolbar-btn" data-action="italic" title="Italic"><i>I</i></button>
          <select id="preset-wishes" style="padding: 4px 8px; font-size: 13px; border-radius: 4px; border: 1px solid var(--border-color, #ccc);">
            <option value="">✨ Choose Quick Wish Template...</option>
            <option value="Wishing you a day filled with happiness and a year filled with joy. Happy Birthday!">Birthday Wish</option>
            <option value="May the magic of this special day bring you endless peace and love. Happy Anniversary!">Anniversary Wish</option>
            <option value="Wishing you a prosperous, healthy, and joyous New Year ahead!">New Year Wish</option>
          </select>
        </div>

        <textarea id="input-content" rows="5" maxlength="500" placeholder="Type your heartfelt wish message here..." style="width: 100%; padding: 10px; border-radius: 6px; border: 1px solid var(--border-color, #ccc); resize: vertical;"></textarea>
      </div>
    `;
  }

  bindEvents(onUpdate) {
    const textarea = document.getElementById('input-content');
    const charCounter = document.getElementById('char-counter');
    const presetSelect = document.getElementById('preset-wishes');

    // Input & Character Count Handler
    textarea?.addEventListener('input', (e) => {
      const text = e.target.value;
      const currentLength = text.length;
      
      if (charCounter) {
        charCounter.textContent = `${currentLength} / 500 chars`;
      }

      onUpdate({ Content: text.trim() });
    });

    // Preset Template Selector Handler
    presetSelect?.addEventListener('change', (e) => {
      const selectedText = e.target.value;
      if (selectedText && textarea) {
        textarea.value = selectedText;
        textarea.dispatchEvent(new Event('input')); // Trigger input event to update state and counter
      }
    });

    // Simple Formatting Toolbar Handlers (Bold / Italic wrappers)
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
