// api/add-wish-to-db.js
// Wishes Hub: Secure Data Persistence + Self-Healing Firebase Init
// Patel Studio - 2026

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getDatabase } from 'firebase-admin/database';

let db = null;
let rtdb = null;

// 🔥 SAFE INITIALIZATION FUNCTION
function initFirebase() {
  if (db && rtdb) return { db, rtdb };

  if (!getApps().length) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error("Vercel Dashboard par Firebase ke Variables missing hain!");
    }

    // Vercel multi-line string newline handle text fix
    if (privateKey.includes('\\n')) {
      privateKey = privateKey.replace(/\\n/g, '\n');
    }

    initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
      databaseURL: process.env.FIREBASE_DATABASE_URL
    });
  }

  db = getFirestore();
  rtdb = getDatabase();
  return { db, rtdb };
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method Not Allowed' });

  try {
    // Firebase initialize karke instance lena
    const { db: activeDb, rtdb: activeRtdb } = initFirebase();

    // Destructure parameter fields
    const { wishId, title, category, sub_category, image, youtubeId, songTitle, thumbnail } = req.body;

    // =========================================================================
    // 🔥 CONDITION 1: AGAR SIRF GAANA LINK KARNA HAI EXISTING WISH KE SATH
    // =========================================================================
    if (wishId && youtubeId) {
      await activeDb.collection('wishes').doc(wishId).update({
        backgroundMusicId: youtubeId,
        musicTitle: songTitle || ''
      });

      await activeDb.collection('youtube_songs_cache').doc(youtubeId).set({
        youtubeId: youtubeId,
        title: songTitle || '',
        thumbnail: thumbnail || '',
        searchKeyword: (songTitle || '').toLowerCase(),
        savedAt: Date.now()
      }, { merge: true });

      return res.status(200).json({ success: true, message: 'Song successfully linked to wish and globally cached!' });
    }

    // =========================================================================
    // 🔥 CONDITION 2: STANDARD NAYI WISH ENTRY PIPELINE
    // =========================================================================
    let telegramMessageId = null;
    const botToken = process.env.TG_BOT_TOKEN?.trim();
    const chatId = process.env.TG_CHAT_ID?.trim();

    // Telegram Notification Pipeline
    if (botToken && chatId) {
      try {
        let endpoint = image ? 'sendPhoto' : 'sendMessage';
        let payload = { chat_id: chatId };

        if (image) {
          payload.photo = image;
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
      } catch (tgErr) { console.error("Telegram channel log error:", tgErr.message); }
    }

    // Firestore Permanent Document Entry
    const wishRef = activeDb.collection('wishes').doc();
    const newWishId = wishRef.id;

    const wishPayload = {
      wishId: newWishId,
      title: title || '',
      category: category || 'General',
      sub_category: sub_category || '',
      imageUrl: image || null,
      telegramMessageId,
      createdAt: new Date().toISOString()
    };

    if (youtubeId) {
      wishPayload.backgroundMusicId = youtubeId;
      wishPayload.musicTitle = songTitle || '';

      await activeDb.collection('youtube_songs_cache').doc(youtubeId).set({
        youtubeId: youtubeId,
        title: songTitle || '',
        thumbnail: thumbnail || '',
        searchKeyword: (songTitle || '').toLowerCase(),
        savedAt: Date.now()
      }, { merge: true });
    }

    await wishRef.set(wishPayload);

    // Realtime Sync Nodes
    if (activeRtdb) {
      try { await activeRtdb.ref(`wishes/${newWishId}`).set({ likes: 0, shares: 0, views: 0 }); } catch(e){}
    }

    return res.status(200).json({ success: true, message: 'Wish live with direct data persistence!', wishId: newWishId });
  } catch (err) {
    // 🔴 CRITICAL STATUS CHANGE: Server internal errors ke liye status 500 return karein taaki frontend catch kar sake
    return res.status(500).json({ success: false, errorType: 'DatabaseCrash', message: err.message });
  }
}
