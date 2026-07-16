// admin/features/wishes/animation-preview.js
// Patel Studio - 2026

import { globalKeywordsConfig, ANIMATION_MASTER_LIST } from './keywords-config.js';
import { triggerAnimation } from '../../js/live-animations.js';

// Automatic keyword suggestion engine logic integrated directly to avoid separate path latency
async function getAutoSuggestedAnimations(categoryName) {
    let textToScan = categoryName.toLowerCase();
    
    const isNonEnglish = /[^\x00-\x7F]+/.test(textToScan);
    if (isNonEnglish) {
        // Fallback placeholder logic for translator engine
        textToScan = textToScan.toLowerCase();
    }
    
    for (const theme in globalKeywordsConfig) {
        const matchFound = globalKeywordsConfig[theme].keywords.some(keyword => textToScan.includes(keyword));
        if (matchFound) {
            return globalKeywordsConfig[theme].animations;
        }
    }
    
    return ["anim_confetti_blast", "anim_lofi_rain", "anim_hearts_vortex", "anim_neon_fireworks"];
}

// Dynamically updates radio grids based on smart engine recommendations
export async function updateAnimationSuggestions(categoryName) {
    const previewGrid = document.getElementById("animation-preview-grid");
    if (!previewGrid) return;

    previewGrid.innerHTML = "<p>Loading smart animations...</p>";

    // Get suggestions from engine matching keywords config
    const suggestedAnims = await getAutoSuggestedAnimations(categoryName);
    
    previewGrid.innerHTML = "";
    
    suggestedAnims.forEach(animId => {
        const card = document.createElement("div");
        card.className = "animation-option-card";
        
        // Formats "anim_confetti_blast" to human-readable text
        const displayName = animId.replace("anim_", "").replace(/_/g, " ").toUpperCase();
        
        card.innerHTML = `
            <input type="radio" name="selected_animation" value="${animId}" id="${animId}">
            <label for="${animId}">${displayName}</label>
        `;
        
        // Listeners for individual preview selection click
        card.querySelector('input').addEventListener('change', (e) => {
            if (e.target.checked) {
                AnimationPreviewLinker.showPreview(e.target.value);
            }
        });
        
        previewGrid.appendChild(card);
    });
}

// Fixed missing bundle wrapper mapping originally missing from index.js scope
export const AnimationPreviewLinker = {
    showPreview: function(animId) {
        console.log(`🎬 [Preview Linker]: Playing canvas preview for -> ${animId}`);
        const liveBox = document.getElementById('live-preview-box');
        if (liveBox) liveBox.style.display = "block";
        
        // Trigger the canvas loop live engine directly
        if (typeof triggerAnimation === 'function') {
            triggerAnimation(animId);
        }
        
        // Synchronize static dropdown UI selector value if available
        const selectEl = document.getElementById('wish-animation');
        if (selectEl) {
            // Check if option exists in dynamic dropdown setup before setting value
            const targetOption = selectEl.querySelector(`option[value="${animId}"]`);
            if (targetOption) {
                selectEl.value = animId;
            } else {
                console.warn(`⚠️ [Preview Linker]: Option value "${animId}" not present in active select element.`);
            }
        }
    },
    clearState: function() {
        console.log("🧹 [Preview Linker]: Clearing preview states.");
        const liveBox = document.getElementById('live-preview-box');
        if (liveBox) liveBox.style.display = "none";
    }
};

window.AnimationPreviewLinker = AnimationPreviewLinker;
export default AnimationPreviewLinker;
