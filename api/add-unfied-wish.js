// Wishes-hub/api/add-unified-wish.js
// Combined Engine for Google Sheets Database Sync

import { appendToGoogleSheet } from './sheets.js'; // Google Sheets handler connection

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method Not Allowed. Use POST.' });
    }

    try {
        // Backend key matching payload extract
        const { wishText, mainCategory, subCategory, image } = req.body;

        // Validation Check
        if (!wishText || !mainCategory) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing Required Fields: wishText and mainCategory are mandatory.' 
            });
        }

        // ==========================================================
        // 1. TELEGRAM TRIGGER ENGINE (Using internal upload-to-tg endpoint)
        // ==========================================================
        let telegramMessageId = null;
        let finalImageLink = image || null;

        try {
            const protocol = req.headers['x-forwarded-proto'] || 'http';
            const host = req.headers.host;
            const tgApiUrl = `${protocol}://${host}/api/upload-to-tg`;

            // Data format map karke upload-to-tg ko hit karna
            const tgResponse = await fetch(tgApiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    title: wishText, 
                    category: mainCategory, 
                    sub_category: subCategory, 
                    image: image 
                })
            });

            const tgData = await tgResponse.json();

            if (tgData.success) {
                telegramMessageId = tgData.message_id;
                if (tgData.fileUrl) {
                    finalImageLink = tgData.fileUrl; // Safe cloud fileUrl string
                }
            }
        } catch (tgErr) {
            console.error("🚨 Telegram auto-pipeline skipped:", tgErr.message);
        }

        // ==========================================================
        // 2. GOOGLE SHEETS SYNC ENGINE (Replaced Firebase)
        // ==========================================================
        const uniqueWishId = `WISH_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const createdAt = new Date().toISOString();

        const wishRowData = {
            id: uniqueWishId,
            title: wishText,
            wishText: wishText,
            category: mainCategory,
            mainCategory: mainCategory,
            sub_category: subCategory || '',
            subCategory: subCategory || '',
            image: finalImageLink || '',
            tgMessageId: telegramMessageId || '',
            status: "active",
            createdAt: createdAt
        };

        // Append data to Google Sheets via sheets.js helper
        await appendToGoogleSheet(wishRowData);

        return res.status(200).json({
            success: true,
            message: "Wish Published onto Google Sheets Successfully!",
            wishId: uniqueWishId,
            tgMessageId: telegramMessageId
        });

    } catch (error) {
        console.error("🚨 Unified Pipeline Error:", error);
        return res.status(500).json({
            success: false,
            message: 'Pipeline rejected packet entry.',
            error: error.message
        });
    }
}
