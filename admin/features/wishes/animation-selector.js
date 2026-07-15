// ==========================================================
// 🎨 WISHES HUB - ANIMATION SELECTOR MODULE (RESOLVED)
// Patel Studio - 2026
// ==========================================================

const AnimationSelector = {
    // 1. Form ke andar Dropdown render karne ke liye HTML template (Fixed Colors for Light/Dark Theme Compatibility)
    render: function() {
        return `
            <div class="form-group" style="margin-top: 20px; margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #64748b; font-family: inherit;">
                    Select Animation
                </label>
                <select id="wish-animation" style="width: 100%; padding: 12px 15px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 15px; background: #ffffff !important; color: #1e293b !important; box-sizing: border-box; outline: none; -webkit-appearance: select; cursor: pointer; font-family: inherit;">
                    <option value="none" style="color: #1e293b !important; background-color: #ffffff !important;">No Animation</option>
                    <option value="confetti" style="color: #1e293b !important; background-color: #ffffff !important;">Confetti 🎉</option>
                    <option value="hearts" style="color: #1e293b !important; background-color: #ffffff !important;">Hearts ❤️</option>
                    <option value="snow" style="color: #1e293b !important; background-color: #ffffff !important;">Snowfall ❄️</option>
                    <option value="fireworks" style="color: #1e293b !important; background-color: #ffffff !important;">Fireworks 🎆</option>
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

// Global aur Module scopes dono ko simultaneously register karein taaki timing error zero ho jaye
window.AnimationSelector = AnimationSelector;
export { AnimationSelector };
export default AnimationSelector;
