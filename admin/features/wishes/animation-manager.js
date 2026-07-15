// ==========================================================
// 🚀 WISHES HUB - CENTRAL ANIMATION MANAGER (COMPLETE MODULE)
// Patel Studio - 2026
// ==========================================================

import { globalKeywordsConfig } from './keywords-config.js';
import { AnimationSelector } from './animation-selector.js';
import { AnimationPreviewLinker } from './animation-preview.js';

// Language Translator Engine Fallback
async function translateToEnglish(text) {
    try {
        return text; 
    } catch (error) {
        console.error("Translation error, using original text", error);
        return text;
    }
}

// Automatic keyword suggestion engine logic
export async function getAutoSuggestedAnimations(categoryName) {
    let textToScan = categoryName.toLowerCase();
    
    const isNonEnglish = /[^\x00-\x7F]+/.test(textToScan);
    if (isNonEnglish) {
        textToScan = await translateToEnglish(textToScan);
        textToScan = textToScan.toLowerCase();
    }
    
    for (const theme in globalKeywordsConfig) {
        const matchFound = globalKeywordsConfig[theme].keywords.some(keyword => textToScan.includes(keyword));
        if (matchFound) {
            return globalKeywordsConfig[theme].animations;
        }
    }
    
    return ["confetti", "snow", "hearts", "fireworks"];
}

// Core Manager Object
const AnimationManager = {
    // 1. Form UI ke andar Selector Dropdown mount karna
    initSelector: function() {
        const fileInput = document.getElementById('wish-image-file');
        if (!fileInput) return;

        const formGroupElement = fileInput.closest('.form-group');
        if (formGroupElement && !document.getElementById('wish-animation')) {
            const selectorHtml = AnimationSelector.render();
            formGroupElement.insertAdjacentHTML('afterend', selectorHtml);
            console.log("🎯 [Animation Manager]: Selector Mounted Successfully.");
            
            this.bindEvents();
        }
    },

    // 2. Dropdown changes aur Auto-Suggest systems bind karna
    bindEvents: function() {
        const selectEl = document.getElementById('wish-animation');
        const subCatSelect = document.getElementById('sub-category');

        if (selectEl) {
            selectEl.addEventListener('change', (e) => {
                const currentSelection = e.target.value;
                console.log(`📡 [Animation Manager]: Manual Selection -> ${currentSelection}`);
                AnimationPreviewLinker.showPreview(currentSelection);
            });
        }

        if (subCatSelect) {
            subCatSelect.addEventListener('change', async (e) => {
                const selectedSubCat = e.target.value;
                if (!selectedSubCat) return;

                console.log(`🔍 [Animation Manager]: Auto Scanning -> ${selectedSubCat}`);
                const suggestedAnimations = await getAutoSuggestedAnimations(selectedSubCat);

                if (suggestedAnimations && suggestedAnimations.length > 0) {
                    let bestMatch = 'none';
                    const matchText = suggestedAnimations[0].toLowerCase();
                    
                    if (matchText.includes('confetti')) bestMatch = 'confetti';
                    else if (matchText.includes('heart')) bestMatch = 'hearts';
                    else if (matchText.includes('snow')) bestMatch = 'snow';
                    else if (matchText.includes('firework')) bestMatch = 'fireworks';

                    if (selectEl) {
                        selectEl.value = bestMatch;
                        console.log(`✨ [Animation Manager]: Auto-Selected -> ${bestMatch}`);
                        AnimationPreviewLinker.showPreview(bestMatch);
                    }
                }
            });
        }
    },

    // 3. Core Database post payload structure mapping
    preparePayload: function(currentPayload) {
        if (AnimationSelector) {
            currentPayload.animation = AnimationSelector.getValue();
        } else {
            currentPayload.animation = 'none';
        }
        console.log("📦 [Animation Manager Payload]: Linked ->", currentPayload.animation);
        return currentPayload;
    },

    // 4. System variables aur UI values reset karna
    reset: function() {
        if (AnimationSelector) AnimationSelector.reset();
        if (AnimationPreviewLinker) AnimationPreviewLinker.clearState();
        console.log("♻️ [Animation Manager]: Reset successfully completed.");
    }
};

// Global environment connection
window.AnimationManager = AnimationManager;

export default AnimationManager;
