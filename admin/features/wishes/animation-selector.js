// ==========================================================
// 🎨 WISHES HUB - ANIMATION SELECTOR MODULE (FINAL RESOLVED)
// Patel Studio - 2026
// ==========================================================

const AnimationSelector = {
    // 1. Form ke andar Dropdown render karne ke liye HTML template (Robust compatibility framework)
    render: function() {
        return `
            <div class="form-group" style="margin-top: 22px; margin-bottom: 22px; width: 100%; display: block; box-sizing: border-box;">
                <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #475569; font-size: 14px; font-family: inherit; text-align: left;">
                    Select Animation Effect
                </label>
                <div style="width: 100%; position: relative; display: block; box-sizing: border-box;">
                    <select id="wish-animation" name="animation" style="display: block !important; visibility: visible !important; width: 100%; height: 46px; padding: 10px 16px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 15px; background-color: #ffffff !important; color: #0f172a !important; box-sizing: border-box; outline: none; cursor: pointer; font-family: inherit; -webkit-appearance: select !important; -moz-appearance: select !important; appearance: select !important;">
                        <option value="none" style="color: #0f172a !important; background-color: #ffffff !important;">No Animation</option>
                        <option value="confetti" style="color: #0f172a !important; background-color: #ffffff !important;">Confetti 🎉</option>
                        <option value="hearts" style="color: #0f172a !important; background-color: #ffffff !important;">Hearts ❤️</option>
                        <option value="snow" style="color: #0f172a !important; background-color: #ffffff !important;">Snowfall ❄️</option>
                        <option value="fireworks" style="color: #0f172a !important; background-color: #ffffff !important;">Fireworks 🎆</option>
                    </select>
                </div>
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
