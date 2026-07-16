// ==========================================================
// 🎨 WISHES HUB ADMIN - ANIMATION SELECTOR COMPONENT (DYNAMIC VERSION)
// Patel Studio - 2026
// ==========================================================

const AnimationSelector = {
    render: function() {
        console.log("🛠️ [AnimationSelector]: Dynamic rendering started...");
        
        // Agar window par live animation registry milti hai toh use lein, nahi toh fallback list
        const activeAnimations = window.SUPPORTED_ANIMATIONS || [
            { id: "anim_hearts_vortex", name: "Hearts ❤️" },
            { id: "anim_confetti_blast", name: "Confetti 🎉" },
            { id: "anim_neon_fireworks", name: "Fireworks 🎆" },
            { id: "anim_lofi_rain", name: "Snowfall/Rain ❄️" }
        ];

        // Loop karke saare option tags dynamic banana
        let optionsHtml = `<option value="none" style="color: #000000 !important; background-color: #ffffff !important;">No Animation 🚫</option>`;
        
        activeAnimations.forEach(anim => {
            optionsHtml += `
                <option value="${anim.id}" style="color: #000000 !important; background-color: #ffffff !important;">
                    ${anim.name}
                </option>
            `;
        });

        return `
            <div class="form-group" style="margin-top: 15px; margin-bottom: 15px; width: 100%; display: block !important; clear: both;">
                <label style="display: block !important; margin-bottom: 8px; font-weight: 600; color: #475569 !important; font-size: 14px; text-align: left;">
                    Select Animation Effect
                </label>
                <!-- added custom scroll handling styles to option parent to prevent layout issues -->
                <select id="wish-animation" name="animation" style="display: block !important; visibility: visible !important; width: 100% !important; height: 44px !important; padding: 10px 12px !important; border: 1px solid #cbd5e1 !important; border-radius: 8px !important; font-size: 15px !important; background-color: #ffffff !important; color: #000000 !important; opacity: 1 !important; box-sizing: border-box !important; cursor: pointer; -webkit-appearance: revert !important; appearance: revert !important;">
                    ${optionsHtml}
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

window.AnimationSelector = AnimationSelector;
