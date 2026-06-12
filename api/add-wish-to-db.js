import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getDatabase } from 'firebase-admin/database';

// Firebase Initialization
const firebaseConfig = JSON.parse(process.env.FIREBASE_MAIN); 
if (!getApps().length) {
  initializeApp({
    credential: cert(firebaseConfig),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });
}

const db = getFirestore();
const rtdb = getDatabase();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const { title, category, tgData } = req.body; 
    // tgData mein wahi result aayega jo pichli file (upload-to-tg) se mila tha

    // 1. Firestore mein Entry Save Karna
    const wishRef = db.collection('wishes').doc();
    const wishId = wishRef.id;

    await wishRef.set({
      wishId: wishId,
      title: title,
      category: category,
      telegramFileId: tgData.telegramFileId, // Permanent link
      fileType: tgData.fileType,            // photo/video/animation
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
    return res.status(500).json({ success: false, message: error.message });
  }
  }
