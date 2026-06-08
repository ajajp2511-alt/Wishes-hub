// Wishes Hub: Admin Wishes Core Logic Layer
// Pure Data & Logic Functions - 2026

window.processAndPublishWish = async (wishText, tgFileId, category) => {
    // 1. Validation Logic (Ab yeh yahan rahega)
    if (!wishText.trim() || !tgFileId.trim()) {
        return { ok: false, error: "Missing Fields: Content text and Telegram File ID are mandatory." };
    }

    try {
        // 2. Network Transmission Logic (Vercel API POST Request)
        const response = await fetch('/api/add-wish', {
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
        return data; // Server se jo result aayega ({ ok: true } ya { ok: false, error: "..." }) wo return hoga

    } catch (error) {
        console.error("Data Layer Network Error:", error);
        return { ok: false, error: "API Connection Failed! Please check Vercel dashboard configuration." };
    }
};
