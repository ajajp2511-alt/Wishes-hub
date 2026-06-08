// Wishes Hub: Admin Wishes Core Logic Layer
// Pure Data Insertion Module (No Password Handling) - 2026

window.publishWishToDatabase = async (wishText, tgFileId, category, adminPassword) => {
    // Core Data Validation
    if (!wishText.trim() || !tgFileId.trim()) {
        return { ok: false, error: "Missing Fields: Content text and Telegram File ID are mandatory." };
    }

    try {
        // Direct Network Transmission to your Unified Wish API
        const response = await fetch('/api/add-unfied-wish', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: wishText,
                tgFileId: tgFileId,
                category: category || "General",
                password: adminPassword 
            })
        });

        const data = await response.json();
        return data; 

    } catch (error) {
        console.error("Wishes Layer Network Error:", error);
        return { ok: false, error: "Database API Connection Failed!" };
    }
};
