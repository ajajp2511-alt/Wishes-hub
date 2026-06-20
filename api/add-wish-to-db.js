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
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });
}

const db = getFirestore();
const rtdb = getDatabase();

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const { title, category, sub_category, image } = req.body;
    
    let telegramMessageId = null;
    let fileUrl = null;
    let fileId = null;
    let fileType = 'photo';

    // Fetching variables safely
    const botToken = process.env.TG_BOT_TOKEN ? process.env.TG_BOT_TOKEN.trim() : null;
    const chatId = process.env.TG_CHAT_ID ? process.env.TG_CHAT_ID.trim() : null;

    const textMessage = `📌 Category: ${category || 'General'}\n📁 Sub-Category: ${sub_category || 'None'}\n\n✍️ Wish: ${title || ''}`;

    // 🔥 FALLBACK CHECK: Agar token missing hai toh crash nahi hoga, direct data db me jayega!
    if (!botToken || !chatId) {
        console.warn("⚠️ Warning: TG_BOT_TOKEN or TG_CHAT_ID is missing in Vercel environment variables!");
    } else {
        // Safe Execution of Telegram Channel Send
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

                let telegramUrl = `https://api.telegram.org/bot${botToken}/${isGif ? 'sendAnimation' : 'sendPhoto'}`;
                if (isGif) {
                    tgPayload.animation = image;
                } else {
                    tgPayload.photo = image;
                }

                const tgResponse = await fetch(telegramUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(tgPayload)
                });

                const tgResult = await tgResponse.json();

                if (tgResult.ok) {
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
                        if (fileInfo.ok) {
                            fileUrl = `https://api.telegram.org/file/bot${botToken}/${fileInfo.result.file_path}`;
                        }
                    }
                }
            } else {
                // Text message flow
                const tgResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ chat_id: chatId, text: textMessage, parse_mode: 'HTML' })
                });
                const tgResult = await tgResponse.json();
                if (tgResult.ok) telegramMessageId = tgResult.result.message_id;
            }
        } catch (tgError) {
            console.error("Telegram runtime network block bypassed:", tgError);
        }
    }

    // 3. FIRESTORE DATABASE BACKUP (Yeh hamesha chalega!)
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

    // 4. REALTIME DATABASE NODE SETUP
    await rtdb.ref(`wishes/${wishId}`).set({ likes: 0, shares: 0, views: 0 });

    return res.status(200).json({ 
      success: true, 
      message: 'Wish live aur database me sync ho chuki hai!', 
      wishId 
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: `Server Error: ${error.message}` });
  }
                  }
