import { uploadToTelegram, saveToDatabase } from '../features/wishes/wish-api.js';

const wishForm = document.getElementById('wishForm');
const statusDisplay = document.getElementById('status-message');

wishForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // 1. UI Status: Processing start
    statusDisplay.innerText = "⏳ Uploading to Telegram...";
    
    const formData = new FormData(wishForm);
    
    try {
        // 2. Logic Call: Pehle Telegram upload
        const tgData = await uploadToTelegram(formData);
        
        if (!tgData.success) throw new Error("Telegram Upload failed!");
        
        statusDisplay.innerText = "💾 Saving to Database...";
        
        // 3. Logic Call: Phir Database save
        const dbData = await saveToDatabase({
            title: formData.get('title'),
            category: formData.get('category'),
            tgData: tgData
        });
        
        if (dbData.success) {
            statusDisplay.innerText = "✅ Wish successfully live!";
            wishForm.reset(); // Form clear karna
        }

    } catch (error) {
        statusDisplay.innerText = "🚨 Error: " + error.message;
    }
});
