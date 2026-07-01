// admin/features/wishes/animation-preview.js
import { getAutoSuggestedAnimations } from './auto-animation-engine.js';

// Yeh function tab chalega jab koi category choose hogi ya likhi jayegi
export async function updateAnimationSuggestions(categoryName) {
    const previewGrid = document.getElementById("animation-preview-grid"); // UI Element
    if (!previewGrid) return;

    previewGrid.innerHTML = "<p>Loading smart animations...</p>";

    // Engine se suggested animations ki list lo
    const suggestedAnims = await getAutoSuggestedAnimations(categoryName);
    
    // UI ko saaf karo aur naye filtered options render karo
    previewGrid.innerHTML = "";
    
    suggestedAnims.forEach(animId => {
        const card = document.createElement("div");
        card.className = "animation-option-card";
        
        // "anim_confetti_blast" ko render karne ke liye clean "CONFETTI BLAST" banata hai
        const displayName = animId.replace("anim_", "").replace(/_/g, " ").toUpperCase();
        
        card.innerHTML = `
            <input type="radio" name="selected_animation" value="${animId}" id="${animId}">
            <label for="${animId}">${displayName}</label>
        `;
        
        previewGrid.appendChild(card);
    });
}
