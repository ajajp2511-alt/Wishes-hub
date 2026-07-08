// Wishes-hub/api/add-unified-wish.js
// Patel Studio - 2026
// Combined Engine for Realtime Database Sync

import admin from 'firebase-admin';

// FIREBASE ADMIN SDK CRASH-PROOF INITIALIZATION
if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
            }),
            databaseURL: process.env.FIREBASE_DATABASE_URL
        });
        console.log("🚀 Firebase Admin Engine initialized successfully in Unified Router!");
    } catch (error) {
        console.error("🚨 Firebase Admin Initialization Failed:", error);
    }
}

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
        // 2. REALTIME DATABASE PUSH ENGINE (Firestore se Realtime DB kiya)
        // ==========================================================
        const db = admin.database();
        const wishesRef = db.ref('wishes').push();
        const newKey = wishesRef.key;

        const wishData = {
            id: newKey,
            title: wishText,              // Global naming format mapping
            wishText: wishText,           // Fallback support for older frontend pages
            category: mainCategory,        
            mainCategory: mainCategory,   // Fallback supporting code
            sub_category: subCategory || '',
            subCategory: subCategory || '', 
            image: finalImageLink,
            tgMessageId: telegramMessageId,
            status: "active",
            createdAt: new Date().toISOString()
        };

        // Realtime database node save sequence
        await wishesRef.set(wishData);

        return res.status(200).json({
            success: true,
            message: "Wish Published onto the Synchronized Database!",
            wishId: newKey,
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
