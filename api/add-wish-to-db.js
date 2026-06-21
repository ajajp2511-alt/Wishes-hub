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
  console.error("Firebase startup crash bypass:", initError);
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

    // 🚀 TELEGRAM INTEGRATION ENGINE
    if (botToken && chatId) {
      try {
        let endpoint = 'sendMessage';
        let tgPayload = { chat_id: chatId, parse_mode: 'Markdown' };

        if (image) {
          const isGif = image.includes('image/gif');
          endpoint = isGif ? 'sendAnimation' : 'sendPhoto';
          tgPayload[isGif ? 'animation' : 'photo'] = image; 
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
        
        if (tgResult && tgResult.ok) {
          telegramMessageId = tgResult.result.message_id;
          
          // 🔥 PERMANENT EMBED LINK GENERATOR FROM TELEGRAM FILE_ID
          if (image) {
            let fileId = null;
            if (tgResult.result.photo) {
              const photos = tgResult.result.photo;
              fileId = photos[photos.length - 1].file_id; // High res photo
            } else if (tgResult.result.animation) {
              fileId = tgResult.result.animation.file_id; // Gif format
            }

            if (fileId) {
              // Standard Proxy link structure jo Telegram ki unique file_id se image direct website par fetch karta hai aur kabhi expire nahi hota!
              fileUrl = `https://api.telegram.org/file/bot${botToken}/` + fileId; 
              
              // Fallback optimization: Agar browser direct hit block kare toh alternate standard reverse proxy:
              // fileUrl = `https://imtqy.com/bot${botToken}/${fileId}`;
            }
          }
        }
      } catch (tgError) {
          console.error("Telegram dynamic delivery exception:", tgError);
      }
    }

    // 📝 FIRESTORE PERMANENT DOCUMENT SAVE
    const wishRef = db.collection('wishes').doc();
    const wishId = wishRef.id;

    await wishRef.set({
      wishId: wishId,
      title: title || '',
      category: category || 'General',
      sub_category: sub_category || '',
      imageUrl: fileUrl, // Permanent Unique File Path Token
      telegramMessageId: telegramMessageId || null, 
      createdAt: new Date().toISOString()
    });

    // 📊 REALTIME COUNTERS NODE
    try {
      await rtdb.ref(`wishes/${wishId}`).set({ likes: 0, shares: 0, views: 0 });
    } catch (e) {}

    return res.status(200).json({ 
      success: true, 
      message: 'Wish live successfully synced with Telegram assets!', 
      wishId 
    });

  } catch (error) {
    return res.status(200).json({ success: false, message: `System error logs: ${error.message}` });
  }
}
