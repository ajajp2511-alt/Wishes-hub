// /api/add-unified-wish.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// Firebase config (Vercel Env Variables use karein)
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    projectId: process.env.FIREBASE_PROJECT_ID,
    // ... baki config
};
const db = getFirestore(initializeApp(firebaseConfig));

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send("Method Not Allowed");

    try {
        // 1. Telegram par Image Upload (using Telegram Bot API)
        // FormData se image le kar Telegram API ko bhejein
        const fileId = await uploadToTelegram(req.body.image); 

        // 2. Firebase me Data save karein
        await addDoc(collection(db, "wishes"), {
            mainCategory: req.body.mainCategory,
            subCategory: req.body.subCategory,
            wishText: req.body.wishText,
            telegramFileId: fileId, // Yahan photo ki unique ID store hogi
            createdAt: new Date().toISOString(),
            status: "active"
        });

        res.status(200).json({ success: true, message: "Wish Published!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
