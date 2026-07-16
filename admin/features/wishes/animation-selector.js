// ==========================================================
// 🎨 WISHES HUB ADMIN - ANIMATION SELECTOR COMPONENT (FIXED GLOBAL)
// Patel Studio - 2026
// ==========================================================

const AnimationSelector = {
    render: function() {
        console.log("🛠️ [AnimationSelector]: render() executed!");

        // Safest approach: Static list of exactly supported live engine animations
        const activeAnimations = [
            { id: "anim_hearts_vortex", name: "Hearts ❤️" },
            { id: "anim_infinite_heart_vortex", name: "Infinite Heart Vortex 💖" },
            { id: "anim_confetti_blast", name: "Confetti 🎉" },
            { id: "anim_neon_fireworks", name: "Fireworks 🎆" },
            { id: "anim_magical_firework_fountain", name: "Firework Fountain 🎇" },
            { id: "anim_golden_glitter_shower", name: "Golden Glitter Shower ✨" },
            { id: "anim_lofi_rain", name: "Snowfall/Rain ❄️🌧️" },
            { id: "anim_cyberpunk_glitch", name: "Cyberpunk Glitch 👾" },
            { id: "anim_starry_constellation", name: "Starry Constellation 🌌" },
            { id: "anim_anime_power_up", name: "Anime Power Up 🔥" },
            { id: "anim_thug_life", name: "Thug Life 😎" },
            { id: "anim_bubble_wrap_pop", name: "Bubble Wrap Pop 🫧" }
        ];

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

// Pure global assignment for non-module standard loading
window.AnimationSelector = AnimationSelector;
