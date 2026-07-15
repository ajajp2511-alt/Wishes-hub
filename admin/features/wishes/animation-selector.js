// ==========================================================
// 🎨 WISHES HUB - ANIMATION SELECTOR MODULE (PREVENT CACHE)
// Patel Studio - 2026
// ==========================================================

const AnimationSelector = {
    // 1. Dropdown HTML template with inline layout safety
    render: function() {
        console.log("🛠️ [AnimationSelector]: render() function executed!");
        return `
            <div class="form-group" style="margin-top: 15px; margin-bottom: 15px; width: 100%; display: block !important; clear: both;">
                <label style="display: block !important; margin-bottom: 8px; font-weight: 600; color: #475569 !important; font-size: 14px; text-align: left;">
                    Select Animation Effect
                </label>
                <select id="wish-animation" name="animation" style="display: block !important; visibility: visible !important; width: 100% !important; height: 44px !important; padding: 10px 12px !important; border: 1px solid #cbd5e1 !important; border-radius: 8px !important; font-size: 15px !important; background-color: #ffffff !important; color: #000000 !important; opacity: 1 !important; box-sizing: border-box !important; -webkit-appearance: select !important; appearance: select !important;">
                    <option value="none" style="color: #000000 !important; background-color: #ffffff !important;">No Animation</option>
                    <option value="confetti" style="color: #000000 !important; background-color: #ffffff !important;">Confetti 🎉</option>
                    <option value="hearts" style="color: #000000 !important; background-color: #ffffff !important;">Hearts ❤️</option>
                    <option value="snow" style="color: #000000 !important; background-color: #ffffff !important;">Snowfall ❄️</option>
                    <option value="fireworks" style="color: #000000 !important; background-color: #ffffff !important;">Fireworks 🎆</option>
                </select>
            </div>
        `;
    },

    getValue: function() {
        const selectEl = document.getElementById('wish-animation');
        return selectEl ? selectEl.value : 'none';
    },

    reset: function() {
        const selectEl = document.getElementById('wish-animation');
        if (selectEl) {
            selectEl.value = 'none';
        }
    }
};

// Direct assignments to destroy any timing/scoping delays
window.AnimationSelector = AnimationSelector;
export { AnimationSelector };
export default AnimationSelector;
