// admin/features/wishes/animation-preview.js
import { getAutoSuggestedAnimations } from './auto-animation-engine.js';
import { triggerAnimation } from '../../js/live-animations.js';

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
        if (selectEl && selectEl.querySelector(`option[value="${animId}"]`)) {
            selectEl.value = animId;
        }
    },
    clearState: function() {
        console.log("🧹 [Preview Linker]: Clearing preview states.");
        const liveBox = document.getElementById('live-preview-box');
        if (liveBox) liveBox.style.display = "none";
    }
};

window.AnimationPreviewLinker = AnimationPreviewLinker;
