// admin/features/wishes/wish-saver.js
import { getAutoSuggestedAnimations } from './auto-animation-engine.js';

export async function handleSaveWish(event) {
    event.preventDefault();

    const categoryInput = document.getElementById("category-input-field").value;
    const wishTextInput = document.getElementById("wish-text-field").value;

    // 1. Category check karke auto-animation ID generate karo
    const suggestedAnimations = await getAutoSuggestedAnimations(categoryInput);
    const finalSelectedAnim = suggestedAnimations[0]; 

    // 2. Vercel ke naye API Route (/api/send-wish) par hit karo
    try {
        const response = await fetch('/api/send-wish', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                category: categoryInput,
                wishText: wishTextInput,
                animId: finalSelectedAnim
            })
        });

        const result = await response.json();

        if (result.success) {
            alert(`🎉 Telegram par data bhej diya gaya hai! Animation: ${finalSelectedAnim}`);
            // Form clear karne ke liye
            document.getElementById("category-input-field").value = "";
            document.getElementById("wish-text-field").value = "";
        } else {
            console.error("API Error:", result.error);
            alert("Backend se error aaya, check console.");
        }

    } catch (error) {
        console.error("Network Error:", error);
        alert("Server tak request nahi pahonch rahi hai!");
    }
}
