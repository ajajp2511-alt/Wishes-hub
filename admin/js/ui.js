import { verifyAdminPassword } from './auth.js';
import { uploadMediaToTelegram, saveWishToDatabase } from './api.js';

// Login Event
document.getElementById('unlock-btn').addEventListener('click', async () => {
    const pass = document.getElementById('admin-password-field').value;
    if (await verifyAdminPassword(pass)) {
        // Switch view logic
    }
});

// Wish Submit Event
document.getElementById('wishForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // Step 1: Telegram
    const tgData = await uploadMediaToTelegram(formData);
    
    // Step 2: Database
    if (tgData.success) {
        const dbData = await saveWishToDatabase({
            title: formData.get('title'),
            category: formData.get('category'),
            tgData: tgData
        });
        alert(dbData.message);
    }
});
