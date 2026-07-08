// ==========================================================
// 📡 WISHES HUB BACKEND - API ROUTER (COMPLETE ENGINE)
// Patel Studio - 2026
// ==========================================================

import admin from 'firebase-admin';

// 1. FIREBASE ADMIN SDK INITIALIZATION
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
        console.log("🚀 Firebase Admin Engine initialized successfully!");
    } catch (error) {
        console.error("🚨 Firebase Admin Initialization Failed:", error);
    }
}

// 2. CORE ROUTER HANDLER
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
        let finalImageLink = image || null; // By default original image rakhenge

        try {
            // Hamein khud ke hi server ke `upload-to-tg` route ko hit karna hai
            // Vercel/Netlify par host hone ke baad relative URL ke liye protocol detect karna zaroori hai
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
                // Agar Telegram se koi high-speed CDN image link mila hai (fileUrl), 
                // to use hum Firebase me store karenge taaki hamara Firebase storage space bache!
                if (tgData.fileUrl) {
                    finalImageLink = tgData.fileUrl;
                }
                console.log("✅ Telegram auto-post sync complete! Message ID:", telegramMessageId);
            } else {
                console.error("⚠️ Telegram route returned an error:", tgData.error);
                // Note: Telegram fail hone par bhi database me data save hone dena hai, isliye throw nahi kar rahe
            }
        } catch (tgErr) {
            console.error("🚨 Failed to establish connection with Telegram pipeline:", tgErr.message);
        }

        // ==========================================================
        // STEP 2: DATABASE ME DATA INSERT KARNA
        // ==========================================================
        const db = admin.database();
        const wishesRef = db.ref('wishes').push();

        const wishData = {
            id: wishesRef.key,
            title: title,
            category: category,
            sub_category: sub_category || '',
            image: finalImageLink, // Telegram URL ya direct Base64 string
            tgMessageId: telegramMessageId, // Future reference ke liye database me save kar rahe hain
            createdAt: new Date().toISOString()
        };

        await wishesRef.set(wishData);

        // Success response pipeline
        return res.status(200).json({
            success: true,
            message: 'Data successfully pushed onto Firebase and synced with Telegram.',
            wishId: wishesRef.key,
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
