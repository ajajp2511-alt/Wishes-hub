// api/add-wish-to-db.js
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getDatabase } from 'firebase-admin/database';

if (!getApps().length) {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined;
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });
}

const db = getFirestore();
const rtdb = getDatabase();

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ success: false });

  try {
    const { title, category, sub_category, message_id, fileUrl, telegramFileId, fileType } = req.body; 

    const wishRef = db.collection('wishes').doc();
    const wishId = wishRef.id;

    await wishRef.set({
      wishId: wishId,
      title: title || '',
      category: category || 'General',
      sub_category: sub_category || '',
      imageUrl: fileUrl || null,  
      telegramFileId: telegramFileId || null,
      fileType: fileType || 'photo',
      telegramMessageId: message_id || null, 
      createdAt: new Date().toISOString()
    });

    await rtdb.ref(`wishes/${wishId}`).set({ likes: 0, shares: 0, views: 0 });

    return res.status(200).json({ success: true, message: 'Wish database mein save ho gayi!', wishId });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
