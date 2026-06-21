// api/add-wish-to-db.js
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getDatabase } from 'firebase-admin/database';

let db, rtdb;

try {
  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
      }),
      databaseURL: process.env.FIREBASE_DATABASE_URL
    });
  }
  db = getFirestore();
  rtdb = getDatabase();
} catch (e) { console.error("Firebase Sync Init Error:", e); }

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method Not Allowed' });

  try {
    const { title, category, sub_category, image } = req.body;
    let telegramMessageId = null;

    const botToken = process.env.TG_BOT_TOKEN?.trim();
    const chatId = process.env.TG_CHAT_ID?.trim();

    // 🚀 Telegram Notification Pipeline (For Group Alerts)
    if (botToken && chatId) {
      try {
        let endpoint = image ? 'sendPhoto' : 'sendMessage';
        let payload = { chat_id: chatId };

        if (image) {
          payload.photo = image; // Send raw base64 to telegram
          payload.caption = `📌 *Category:* ${category || 'General'}\n✍️ *Wish:* ${title || ''}`;
          payload.parse_mode = 'Markdown';
        } else {
          payload.text = `📌 *Category:* ${category || 'General'}\n✍️ *Wish:* ${title || ''}`;
          payload.parse_mode = 'Markdown';
        }

        const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const tgJson = await tgRes.json();
        if (tgJson.ok) telegramMessageId = tgJson.result.message_id;
      } catch (tgErr) { console.error("Telegram channel log error:", tgErr); }
    }

    // 📝 Firestore Permanent Document Entry
    const wishRef = db.collection('wishes').doc();
    const wishId = wishRef.id;

    await wishRef.set({
      wishId,
      title: title || '',
      category: category || 'General',
      sub_category: sub_category || '',
      imageUrl: image || null, // 🔥 100% Zero Link Dependancy! Base64 directly database mein save.
      telegramMessageId,
      createdAt: new Date().toISOString()
    });

    // 📊 Realtime Sync Nodes
    try { await rtdb.ref(`wishes/${wishId}`).set({ likes: 0, shares: 0, views: 0 }); } catch(e){}

    return res.status(200).json({ success: true, message: 'Wish live with direct data persistence!', wishId });
  } catch (err) {
    return res.status(200).json({ success: false, message: err.message });
  }
            }
