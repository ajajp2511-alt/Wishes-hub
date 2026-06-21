// api/add-wish-to-db.js
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getDatabase } from 'firebase-admin/database';

let db;
let rtdb;

try {
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
      databaseURL: process.env.FIREBASE_DATABASE_URL
    });
  }
  db = getFirestore();
  rtdb = getDatabase();
} catch (initError) {
  console.error("Firebase Initialization system down:", initError);
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const { title, category, sub_category, image } = req.body;
    let fileUrl = null;
    let telegramMessageId = null;

    const botToken = process.env.TG_BOT_TOKEN ? process.env.TG_BOT_TOKEN.trim() : null;
    const chatId = process.env.TG_CHAT_ID ? process.env.TG_CHAT_ID.trim() : null;
    const textMessage = `📌 *Category:* ${category || 'General'}\n📁 *Sub-Category:* ${sub_category || 'None'}\n\n✍️ *Wish:* ${title || ''}`;

    // 🔥 1. TELEGRAM TELEGRA.PH AUTOMATIC PERMANENT LINK GENERATOR
    if (image) {
      try {
        // Base64 string ko binary form me badalna telegraph ke liye
        const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, 'base64');
        
        const formData = new FormData();
        const blob = new Blob([buffer], { type: 'image/jpeg' });
        formData.append('file', blob, 'wish_image.jpg');

        // Telegraph public server stream par upload
        const phResponse = await fetch('https://telegra.ph/upload', {
            method: 'POST',
            body: formData
        });
        
        const phResult = await phResponse.json();
        
        if (Array.isArray(phResult) && phResult[0] && phResult[0].src) {
          // Yeh link lifetime working link ban gaya!
          fileUrl = `https://telegra.ph${phResult[0].src}`;
        }
      } catch (tgPhErr) {
        console.error("Telegra.ph link generation bypassed:", tgPhErr);
      }
    }

    // 🚀 2. DYNAMIC BROADCAST TO YOUR TELEGRAM CHANNEL
    if (botToken && chatId) {
      try {
        let endpoint = 'sendMessage';
        let tgPayload = { chat_id: chatId, parse_mode: 'Markdown' };

        if (image) {
          const isGrid = image.includes('image/gif');
          endpoint = isGrid ? 'sendAnimation' : 'sendPhoto';
          tgPayload[isGrid ? 'animation' : 'photo'] = image; 
          tgPayload.caption = textMessage;
        } else {
          tgPayload.text = textMessage;
        }

        const tgResponse = await fetch(`https://api.telegram.org/bot${botToken}/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tgPayload)
        });
        const tgResult = await tgResponse.json();
        if (tgResult && tgResult.ok) telegramMessageId = tgResult.result.message_id;
      } catch (tgError) {
          console.error("Telegram notification channel skipped safely:", tgError);
      }
    }

    // 📝 3. FIRESTORE DATABASE ENTRY SAVE (Permanent Telegra.ph Link Store Hoga)
    const wishRef = db.collection('wishes').doc();
    const wishId = wishRef.id;

    await wishRef.set({
      wishId: wishId,
      title: title || '',
      category: category || 'General',
      sub_category: sub_category || '',
      imageUrl: fileUrl, // Pure Telegram Engine Server Link
      telegramMessageId: telegramMessageId || null, 
      createdAt: new Date().toISOString()
    });

    // 📊 4. RTDB VIEWS SETUP
    try {
      await rtdb.ref(`wishes/${wishId}`).set({ likes: 0, shares: 0, views: 0 });
    } catch (e) {}

    return res.status(200).json({ 
      success: true, 
      message: 'Wish live with permanent Telegram server asset link!', 
      wishId 
    });

  } catch (error) {
    return res.status(200).json({ success: false, message: `System Error: ${error.message}` });
  }
      }
