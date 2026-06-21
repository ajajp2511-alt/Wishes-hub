// api/add-wish-to-db.js
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getDatabase } from 'firebase-admin/database';

// Global configurations to keep connections reusable
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
  console.error("Firebase Admin initialization crash:", initError);
}

export default async function handler(req, res) {
  // Hardcoded fallback headers to prevent Vercel HTML override intercepts
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const { title, category, sub_category, image } = req.body;
    
    let telegramMessageId = null;
    let fileUrl = null;
    let fileId = null;
    let fileType = 'photo';

    const botToken = process.env.TG_BOT_TOKEN ? process.env.TG_BOT_TOKEN.trim() : null;
    const chatId = process.env.TG_CHAT_ID ? process.env.TG_CHAT_ID.trim() : null;

    const textMessage = `📌 Category: ${category || 'General'}\n📁 Sub-Category: ${sub_category || 'None'}\n\n✍️ Wish: ${title || ''}`;

    // 1. ISOLATED TELEGRAM MODULE (Bina main execution stream ko block kiye)
    if (botToken && chatId) {
      try {
        if (image) {
          const mimeMatch = image.match(/^data:(image\/\w+);base64,/);
          const contentType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
          const isGif = contentType.includes('gif');
          fileType = isGif ? 'animation' : 'photo';

          const tgPayload = {
              chat_id: chatId,
              caption: textMessage,
              parse_mode: 'HTML'
          };

          const endpoint = isGif ? 'sendAnimation' : 'sendPhoto';
          tgPayload[isGif ? 'animation' : 'photo'] = image;

          // Executing dynamic post stream safely
          const tgResponse = await fetch(`https://api.telegram.org/bot${botToken}/${endpoint}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(tgPayload)
          });

          const tgResult = await tgResponse.json();

          if (tgResult && tgResult.ok) {
              telegramMessageId = tgResult.result.message_id;
              if (isGif && tgResult.result.animation) {
                  fileId = tgResult.result.animation.file_id;
              } else if (tgResult.result.photo) {
                  const photos = tgResult.result.photo;
                  fileId = photos[photos.length - 1].file_id;
              }

              if (fileId) {
                  const fileInfoRes = await fetch(`https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`);
                  const fileInfo = await fileInfoRes.json();
                  if (fileInfo && fileInfo.ok) {
                      fileUrl = `https://api.telegram.org/file/bot${botToken}/${fileInfo.result.file_path}`;
                  }
              }
          }
        } else {
          // Direct fallback text pipeline
          const tgResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ chat_id: chatId, text: textMessage, parse_mode: 'HTML' })
          });
          const tgResult = await tgResponse.json();
          if (tgResult && tgResult.ok) telegramMessageId = tgResult.result.message_id;
        }
      } catch (tgError) {
          console.error("Telegram dynamic integration skipped safely:", tgError);
      }
    }

    // 2. ABSOLUTE FIRESTORE EXECUTION
    const wishRef = db.collection('wishes').doc();
    const wishId = wishRef.id;

    await wishRef.set({
      wishId: wishId,
      title: title || '',
      category: category || 'General',
      sub_category: sub_category || '',
      imageUrl: fileUrl || null,  
      telegramFileId: fileId || null,
      fileType: fileType,
      telegramMessageId: telegramMessageId || null, 
      createdAt: new Date().toISOString()
    });

    // 3. REALTIME SYNC
    try {
      await rtdb.ref(`wishes/${wishId}`).set({ likes: 0, shares: 0, views: 0 });
    } catch (rtdbErr) {
      console.error("RTDB bypass logger:", rtdbErr);
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Wish live successfully synchronized!', 
      wishId 
    });

  } catch (error) {
    console.error("Global system catch triggered:", error);
    // Explicitly fallback JSON structure on total crash to avoid string interceptions
    return res.status(200).json({ 
      success: false, 
      message: `System Bypass Active: ${error.message}` 
    });
  }
                                              }
