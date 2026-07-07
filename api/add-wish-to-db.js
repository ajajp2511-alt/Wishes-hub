// api/add-wish-to-db.js
// Wishes Hub: Secure Data Persistence + Double-Saving Song Cache
// Patel Studio - 2026

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
    // Destructure naye song parameter fields: wishId (for updates), youtubeId, songTitle, thumbnail
    const { wishId, title, category, sub_category, image, youtubeId, songTitle, thumbnail } = req.body;

    // =========================================================================
    // 🔥 CONDITION 1: AGAR SIRF GAANA LINK KARNA HAI EXISTING WISH KE SATH
    // =========================================================================
    if (wishId && youtubeId) {
      // 1. Specific Wish document me background music data attach karna
      await db.collection('wishes').doc(wishId).update({
        backgroundMusicId: youtubeId,
        musicTitle: songTitle || ''
      });

      // 2. Global Song Cache Collection me save karna taaki YouTube Credit bar-bar waste na ho
      await db.collection('youtube_songs_cache').doc(youtubeId).set({
        youtubeId: youtubeId,
        title: songTitle || '',
        thumbnail: thumbnail || '',
        searchKeyword: (songTitle || '').toLowerCase(), // Future search optimisation ke liye
        savedAt: Date.now()
      }, { merge: true });

      return res.status(200).json({ success: true, message: 'Song successfully linked to wish and globally cached!' });
    }

    // =========================================================================
    // 🔥 CONDITION 2: STANDARD NAYI WISH ENTRY PIPELINE (EXISTING CODE)
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
      } catch (tgErr) { console.error("Telegram channel log error:", tgErr); }
    }

    // Firestore Permanent Document Entry
    const wishRef = db.collection('wishes').doc();
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

    // Agar nayi wish ke sath hi song pass kiya hai admin ne toh use add kar dena
    if (youtubeId) {
      wishPayload.backgroundMusicId = youtubeId;
      wishPayload.musicTitle = songTitle || '';

      // Is gaane ko bhi global cache me sath hi sath daal dete hain
      await db.collection('youtube_songs_cache').doc(youtubeId).set({
        youtubeId: youtubeId,
        title: songTitle || '',
        thumbnail: thumbnail || '',
        searchKeyword: (songTitle || '').toLowerCase(),
        savedAt: Date.now()
      }, { merge: true });
    }

    await wishRef.set(wishPayload);

    // Realtime Sync Nodes
    try { await rtdb.ref(`wishes/${newWishId}`).set({ likes: 0, shares: 0, views: 0 }); } catch(e){}

    return res.status(200).json({ success: true, message: 'Wish live with direct data persistence!', wishId: newWishId });
  } catch (err) {
    return res.status(200).json({ success: false, message: err.message });
  }
}
