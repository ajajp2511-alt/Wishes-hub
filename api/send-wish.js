// Wishes-hub/api/send-wish.js
// Integrated Database + Telegram Engine for Frontend Form

import admin from 'firebase-admin';

// FIREBASE INITIALIZATION
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
    } catch (error) {
        console.error("🚨 Firebase Admin Initialization Failed:", error);
    }
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Frontend payload data extract karein (Jo aapke form se aa raha hai)
        const { category, wishText, animId, sub_category, image } = req.body;

        if (!wishText || !category) {
            return res.status(400).json({ success: false, message: 'Missing Fields' });
        }

        // ==========================================================
        // STEP 1: DATABASE REFERENCE GENERATE KARNA
        // ==========================================================
        const db = admin.database();
        const wishesRef = db.ref('wishes').push();
        const newWishId = wishesRef.key; // Ye unique link banane ke liye hai

        // ==========================================================
        // STEP 2: TELEGRAM PAR NOTIFICATION BHEJNA (HTML Mode taaki crash na ho)
        // ==========================================================
        const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || process.env.TG_BOT_TOKEN;
        const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || process.env.TG_CHAT_ID;

        const telegramMessage = `🌟 <b>New Wish Category Added!</b> 🌟\n` +
                                `--------------------------------\n` +
                                `📂 <b>Category:</b> ${category}\n` +
                                `✨ <b>Auto-Animation ID:</b> <code>${animId || 'None'}</code>\n` +
                                `📝 <b>Wish Text:</b> "${wishText}"\n\n` +
                                `🕒 <i>Timestamp: ${new Date().toLocaleString()}</i>`;

        let tgMessageId = null;
        try {
            const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
            const telegramResponse = await fetch(telegramUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: telegramMessage,
                    parse_mode: "HTML"
                })
            });
            const result = await telegramResponse.json();
            if (result.ok) tgMessageId = result.result.message_id;
        } catch (err) {
            console.error("Telegram log failed but continuing database insertion.");
        }

        // ==========================================================
        // STEP 3: DATA KO FIREBASE ME SAVE KARNA
        // ==========================================================
        const wishData = {
            id: newWishId,
            title: wishText, // Taaki frontend is title field ko correctly read kar sake
            category: category,
            sub_category: sub_category || '',
            animId: animId || '',
            image: image || null,
            tgMessageId: tgMessageId,
            createdAt: new Date().toISOString()
        };

        await wishesRef.set(wishData);

        // Success response pipeline - unique ID frontend ko return karenge
        return res.status(200).json({ 
            success: true, 
            message: 'Database and Telegram Sync Complete!',
            wishId: newWishId // Frontend is ID se share URL generate karega
        });

    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}
