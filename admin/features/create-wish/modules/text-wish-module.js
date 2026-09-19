/**
 * Create Wish Feature - Text Wish Sub-Module (Ultra Professional & Attractive)
 * Path: admin/features/create-wish/modules/text-wish-module.js
 */

export class TextWishModule {
  render(container) {
    container.innerHTML = `
      <div class="form-group text-wish-container" style="background: var(--card-bg, #ffffff); padding: 16px; border-radius: 12px; border: 1px solid var(--border-color, #e2e8f0); box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
        
        <!-- Header & Character Counter -->
        <div class="label-wrapper" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <label for="input-content" style="font-weight: 600; font-size: 14px; color: var(--text-primary, #1e293b); display: flex; align-items: center; gap: 6px;">
            <span>✍️</span> Message Content
          </label>
          <span id="char-counter" style="font-size: 12px; font-weight: 500; color: var(--text-muted, #64748b);">0 / 500 chars</span>
        </div>

        <!-- Formatting & Template Toolbar -->
        <div class="text-toolbar" style="display: flex; gap: 6px; margin-bottom: 10px; flex-wrap: wrap; align-items: center; background: var(--toolbar-bg, #f8fafc); padding: 6px; border-radius: 8px; border: 1px solid var(--border-color, #e2e8f0);">
          <button type="button" class="toolbar-btn" data-action="bold" title="Bold" style="background:#fff; border:1px solid #cbd5e1; border-radius:4px; padding:4px 8px; cursor:pointer; font-weight:bold; font-size:12px;"><b>B</b></button>
          <button type="button" class="toolbar-btn" data-action="italic" title="Italic" style="background:#fff; border:1px solid #cbd5e1; border-radius:4px; padding:4px 8px; cursor:pointer; font-style:italic; font-size:12px;"><i>I</i></button>
          
          <select id="text-font-style" style="padding: 4px 8px; font-size: 12px; border-radius: 4px; border: 1px solid #cbd5e1; background:#fff; outline:none;">
            <option value="sans-serif">Default Font</option>
            <option value="cursive">Handwriting Style</option>
            <option value="serif">Classic Serif</option>
          </select>

          <select id="preset-wishes" style="padding: 4px 8px; font-size: 12px; border-radius: 4px; border: 1px solid #cbd5e1; background:#fff; outline:none; margin-left: auto; max-width: 150px; text-overflow: ellipsis;">
            <option value="">✨ Quick Templates</option>
            <option value="Wishing you a day filled with happiness and a year filled with joy. Happy Birthday! 🎉">Birthday Wish</option>
            <option value="May the magic of this special day bring you endless peace and love. Happy Anniversary! ❤️">Anniversary Wish</option>
            <option value="Wishing you a prosperous, healthy, and joyous New Year ahead! 🌟">New Year Wish</option>
          </select>
        </div>

        <!-- Textarea Field -->
        <textarea id="input-content" rows="5" maxlength="500" placeholder="Type your heartfelt wish message here... (Use device emoji keyboard 😊)" style="width: 100%; padding: 12px; font-size: 14px; border-radius: 8px; border: 1px solid #cbd5e1; outline: none; resize: vertical; transition: all 0.2s ease; background: var(--input-bg, #fff); color: var(--text-main, #334155);"></textarea>
      </div>
    `;
  }

  bindEvents(onUpdate) {
    const textarea = document.getElementById('input-content');
    const charCounter = document.getElementById('char-counter');
    const presetSelect = document.getElementById('preset-wishes');
    const fontSelect = document.getElementById('text-font-style');

    // Focus & Blur Visual Glow Effects
    textarea?.addEventListener('focus', () => {
      textarea.style.borderColor = '#6366f1';
      textarea.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.15)';
    });
    textarea?.addEventListener('blur', () => {
      textarea.style.borderColor = '#cbd5e1';
      textarea.style.boxShadow = 'none';
    });

    // Input & Character Count Handler
    textarea?.addEventListener('input', (e) => {
      const text = e.target.value;
      if (charCounter) {
        charCounter.textContent = `${text.length} / 500 chars`;
      }
      onUpdate({ Content: text.trim() });
    });

    // Font Style Handler
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

    // Preset Template Selector Handler
    presetSelect?.addEventListener('change', (e) => {
      const selectedText = e.target.value;
      if (selectedText && textarea) {
        textarea.value = selectedText;
        textarea.dispatchEvent(new Event('input'));
      }
    });

    // Formatting Toolbar Handlers (Bold / Italic)
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
