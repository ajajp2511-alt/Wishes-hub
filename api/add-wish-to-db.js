// ==========================================================
// 📡 WISHES HUB BACKEND - API ROUTER (GOOGLE SHEETS SYNC)
// ==========================================================

import { appendToGoogleSheet } from './sheets.js'; // Google Sheets helper integration

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method Not Allowed. Use POST.' });
    }

    try {
        const { title, category, sub_category, image } = req.body;

        if (!title || !category) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing Required Fields: Wish Content Text and Category are mandatory.' 
            });
        }

        // ==========================================================
        // STEP 1: TELEGRAM PAR DATA UPLOAD KARNA (TRIGGER PIPELINE)
        // ==========================================================
        let telegramMessageId = null;
        let finalImageLink = image || null;

        try {
            const protocol = req.headers['x-forwarded-proto'] || 'http';
            const host = req.headers.host;
            const tgApiUrl = `${protocol}://${host}/api/upload-to-tg`;

            const tgResponse = await fetch(tgApiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, category, sub_category, image })
            });

            const tgData = await tgResponse.json();

            if (tgData.success) {
                telegramMessageId = tgData.message_id;
                if (tgData.fileUrl) {
                    finalImageLink = tgData.fileUrl;
                }
                console.log("✅ Telegram auto-post sync complete! Message ID:", telegramMessageId);
            } else {
                console.error("⚠️ Telegram route returned an error:", tgData.error);
            }
        } catch (tgErr) {
            console.error("🚨 Failed to establish connection with Telegram pipeline:", tgErr.message);
        }

        // ==========================================================
        // STEP 2: GOOGLE SHEETS ME DATA INSERT KARNA (REPLACED FIREBASE)
        // ==========================================================
        const uniqueWishId = `WISH_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const createdAt = new Date().toISOString();

        const wishData = {
            id: uniqueWishId,
            title: title,
            wishText: title, // Fallback support
            category: category,
            mainCategory: category, // Fallback support
            sub_category: sub_category || '',
            subCategory: sub_category || '',
            image: finalImageLink,
            tgMessageId: telegramMessageId || '',
            status: 'active',
            createdAt: createdAt
        };

        // Google Sheet mein row append karna
        await appendToGoogleSheet(wishData);

        // Success response pipeline
        return res.status(200).json({
            success: true,
            message: 'Data successfully pushed onto Google Sheets and synced with Telegram.',
            wishId: uniqueWishId,
            tgMessageId: telegramMessageId
        });

    } catch (error) {
        console.error("🚨 Server Pipeline Error:", error);
        return res.status(500).json({
            success: false,
            message: 'Pipeline rejected packet entry.',
            error: error.message
        });
    }
}
