// ==========================================================
// 📡 WISHES HUB BACKEND - API ROUTER (COMPLETE ENGINE)
// Patel Studio - 2026
// ==========================================================

import admin from 'firebase-admin';

// 1. FIREBASE ADMIN SDK CRASH-PROOF INITIALIZATION
if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                // Private key ke new lines (\n) ko correctly handle karne ke liye replace lagaya hai
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
    // Sirf POST requests ko allow karein
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method Not Allowed. Use POST.' });
    }

    try {
        // Frontend payload data extract karein
        const { title, category, sub_category, image } = req.body;

        // Validation check
        if (!title || !category) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing Required Fields: Wish Content Text and Category are mandatory.' 
            });
        }

        // Realtime Database instance secure karein
        const db = admin.database();
        
        // 'wishes' node ke andar ek naya auto-generated key reference banayein
        const wishesRef = db.ref('wishes').push();

        // Database payload structure object
        const wishData = {
            id: wishesRef.key,
            title: title,
            category: category,
            sub_category: sub_category || '',
            image: image || null, // Base64 string ya image URL string
            createdAt: new Date().toISOString()
        };

        // Data ko Realtime Database mein insert karein
        await wishesRef.set(wishData);

        // Success response pipeline
        return res.status(200).json({
            success: true,
            message: 'Data successfully pushed onto the engine database.',
            wishId: wishesRef.key
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
