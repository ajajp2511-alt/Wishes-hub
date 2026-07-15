// admin/features/wishes/wish-saver.js
import { getAutoSuggestedAnimations } from './auto-animation-engine.js';

export async function handleSaveWish(event) {
    event.preventDefault();

    const categoryInput = document.getElementById("category-input-field").value;
    const wishTextInput = document.getElementById("wish-text-field").value;

    // 🌟 NYA LOGIC: Pehle manual select kiya hua animation check karein, agar nahi mile toh auto-suggest par jayein
    let finalSelectedAnim = "none";
    const manualAnimSelect = document.getElementById("wish-animation");
    
    if (manualAnimSelect && manualAnimSelect.value !== "none") {
        finalSelectedAnim = manualAnimSelect.value;
    } else {
        const suggestedAnimations = await getAutoSuggestedAnimations(categoryInput);
        if (suggestedAnimations && suggestedAnimations.length > 0) {
            finalSelectedAnim = suggestedAnimations[0]; 
        }
    }

    // 2. Vercel ke API Route par hit karo
    try {
        const response = await fetch('/api/send-wish', {
            top: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                category: categoryInput,
                wishText: wishTextInput,
                animId: finalSelectedAnim // Sahi animation id jayegi ab
            })
        });

        const result = await response.json();

        if (result.success) {
            alert(`🎉 Telegram par data bhej diya gaya hai! Animation: ${finalSelectedAnim}`);
            
            // Form aur Dropdown clear karne ke liye
            document.getElementById("category-input-field").value = "";
            document.getElementById("wish-text-field").value = "";
            if (manualAnimSelect) manualAnimSelect.value = "none";
        } else {
            console.error("API Error:", result.error);
            alert("Backend se error aaya, check console.");
        }

    } catch (error) {
        console.error("Network Error:", error);
        alert("Server tak request nahi pahonch rahi hai!");
    }
}
