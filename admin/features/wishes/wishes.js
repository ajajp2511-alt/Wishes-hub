// Wishes Hub: Admin Wishes Core Logic Layer
// Pure Data & Logic Functions - 2026

window.processAndPublishWish = async (wishText, tgFileId, category) => {
    // 1. Validation Logic
    if (!wishText.trim() || !tgFileId.trim()) {
        return { ok: false, error: "Missing Fields: Content text and Telegram File ID are mandatory." };
    }

    try {
        // 2. Network Transmission Logic (Connecting to your exact Vercel API)
        const response = await fetch('/api/add-unfied-wish', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: wishText,
                tgFileId: tgFileId,
                category: category || "General"
            })
        });

        const data = await response.json();
        return data; // Returns response from your Vercel backend

    } catch (error) {
        console.error("Data Layer Network Error:", error);
        return { ok: false, error: "API Connection Failed! Please check Vercel dashboard configuration." };
    }
};
