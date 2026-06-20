// api/add-wish-to-db.js
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getDatabase } from 'firebase-admin/database';

if (!getApps().length) {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY 
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') 
    : undefined;

  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL || `https://${process.env.FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com/`
  });
}

const db = getFirestore();
const rtdb = getDatabase();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    // 📝 Hum pure body payload ko extract kar rahe hain bina kisi strict dependency ke
    const { title, category, sub_category, message_id, success } = req.body; 

    // 1. Firestore mein Entry Save Karna
    const wishRef = db.collection('wishes').doc();
    const wishId = wishRef.id;

    // Optional chaining aur safety fallbacks taaki parameters undefined hone par crash na ho
    await wishRef.set({
      wishId: wishId,
      title: title || '',
      category: category || 'General',
      sub_category: sub_category || '',
      telegramMessageId: message_id || req.body.tgData?.message_id || null, 
      createdAt: new Date().toISOString()
    });

    // 2. Realtime Database mein Live Counters set karna
    await rtdb.ref(`wishes/${wishId}`).set({
      likes: 0,
      shares: 0,
      views: 0
    });

    return res.status(200).json({ 
      success: true, 
      message: 'Wish database mein save ho gayi!', 
      wishId 
    });

  } catch (error) {
    console.error("Firebase Database Error:", error);
    // Explicit server error detail format
    return res.status(500).json({ success: false, message: `DB Operations Failed: ${error.message}` });
  }
}
