// admin/features/wishes/auto-animation-engine.js
import { globalKeywordsConfig } from './keywords-config.js';

// Kisi bhi language ko English mein badalne ke liye translator logic
async function translateToEnglish(text) {
    try {
        // Agar aap koi actual API (jaise Google Translate ya LibreTranslate) use kar rahe hain:
        // const response = await fetch(`YOUR_TRANSLATION_API_URL?text=${text}`);
        // const data = await response.json();
        // return data.translatedText;
        
        return text; // Abhi ke liye fallback default text return kar raha hai
    } catch (error) {
        console.error("Translation error, using original text", error);
        return text;
    }
}

// MAIN FUNCTION: Jo aapke save handler ya frontend dropdown mein call hoga
export async function getAutoSuggestedAnimations(categoryName) {
    let textToScan = categoryName.toLowerCase();
    
    // Check agar text mein English ke alawa koi aur language ke characters hain
    const isNonEnglish = /[^\x00-\x7F]+/.test(textToScan);
    
    if (isNonEnglish) {
        textToScan = await translateToEnglish(textToScan);
        textToScan = textToScan.toLowerCase();
    }
    
    // Keywords database mein scanning cycle
    for (const theme in globalKeywordsConfig) {
        const matchFound = globalKeywordsConfig[theme].keywords.some(keyword => textToScan.includes(keyword));
        if (matchFound) {
            return globalKeywordsConfig[theme].animations;
        }
    }
    
    // Agar koi bhi keyword match nahi hua, toh yeh default safe animations dikhayega
    return ["anim_confetti_blast", "anim_typography_explosion", "anim_gold_foil_press"];
}
