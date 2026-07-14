// ==========================================================
// 🎨 WISHES HUB - ANIMATION SELECTOR MODULE
// Patel Studio - 2026
// ==========================================================

const AnimationSelector = {
    // 1. Form ke andar Dropdown render karne ke liye HTML template
    render: function() {
        return `
            <div class="form-group" style="margin-top: 20px; margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--text-muted);">Select Animation</label>
                <select id="wish-animation" style="width: 100%; padding: 12px 15px; border: 1px solid var(--border); border-radius: 6px; font-size: 15px; background: #fff; box-sizing: border-box; outline: none; color: var(--text-main);">
                    <option value="none">No Animation</option>
                    <option value="confetti">Confetti 🎉</option>
                    <option value="hearts">Hearts ❤️</option>
                    <option value="snow">Snowfall ❄️</option>
                    <option value="fireworks">Fireworks 🎆</option>
                </select>
            </div>
        `;
    },

    // 2. Form submit karte waqt selected value nikalne ke liye utility
    getValue: function() {
        const selectEl = document.getElementById('wish-animation');
        return selectEl ? selectEl.value : 'none';
    },

    // 3. Submit hone ke baad dropdown reset karne ke liye utility
    reset: function() {
        const selectEl = document.getElementById('wish-animation');
        if (selectEl) {
            selectEl.value = 'none';
        }
    }
};

// Global level par register kiya taaki kisi bhi file se access ho sake
window.AnimationSelector = AnimationSelector;
