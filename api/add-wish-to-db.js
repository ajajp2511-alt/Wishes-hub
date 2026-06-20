// api/add-wish-to-db.js
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getDatabase } from 'firebase-admin/database';

// 1. Firebase Initialization
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
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const { title, category, sub_category, image } = req.body;
    
    let telegramMessageId = null;
    let fileUrl = null;
    let fileId = null;
    let fileType = 'photo';

    const botToken = process.env.TG_BOT_TOKEN;
    const chatId = process.env.TG_CHAT_ID;

    // 2. TELEGRAM UPLOAD LOGIC (Agar image aayi hai toh)
    if (image && botToken && chatId) {
      try {
        const mimeMatch = image.match(/^data:(image\/\w+);base64,/);
        const contentType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
        const ext = contentType.split('/')[1] || 'jpg';
        const isGif = contentType.includes('gif');

        const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, 'base64');
        const boundary = `----WebKitFormBoundary${Math.random().toString(36).substring(2)}`;
        
        const telegramUrl = `https://api.telegram.org/bot${botToken}/${isGif ? 'sendAnimation' : 'sendPhoto'}`;
        const mediaParamName = isGif ? 'animation' : 'photo';
        fileType = isGif ? 'animation' : 'photo';

        const textMessage = `📌 *Category:* ${category || 'General'}\n📁 *Sub-Category:* ${sub_category || 'None'}\n\n✍️ *Wish:* ${title || ''}`;

        const parts = [
            `--${boundary}\r\nContent-Disposition: form-data; name="chat_id"\r\n\r\n${chatId}\r\n`,
            `--${boundary}\r\nContent-Disposition: form-data; name="caption"\r\n\r\n${textMessage}\r\n`,
            `--${boundary}\r\nContent-Disposition: form-data; name="parse_mode"\r\n\r\nMarkdown\r\n`,
            `--${boundary}\r\nContent-Disposition: form-data; name="${mediaParamName}"; filename="wish_media.${ext}"\r\nContent-Type: ${contentType}\r\n\r\n`
        ];

        const headerBuffer = Buffer.from(parts.join(''), 'utf-8');
        const footerBuffer = Buffer.from(`\r\n--${boundary}--\r\n`, 'utf-8');
        const multipartBody = Buffer.concat([headerBuffer, buffer, footerBuffer]);

        const tgResponse = await fetch(telegramUrl, {
            method: 'POST',
            headers: { 'Content-Type': `multipart/form-data; boundary=${boundary}` },
            body: multipartBody
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

            // Public Link nikalna Telegram se
            if (fileId) {
                const fileInfoRes = await fetch(`https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`);
                const fileInfo = await fileInfoRes.json();
                if (fileInfo.ok) {
                    fileUrl = `https://api.telegram.org/file/bot${botToken}/${fileInfo.result.file_path}`;
                }
            }
        }
      } catch (tgError) {
         console.error("Telegram Upload Failed, skipping media link:", tgError);
         // Filter out crashes: Agar telegram fail bhi ho, toh database me save ho jaye
      }
    } else if (!image && botToken && chatId) {
      // Photo nahi hai toh normal text message send karein Telegram par
      try {
        const textMessage = `📌 *Category:* ${category || 'General'}\n📁 *Sub-Category:* ${sub_category || 'None'}\n\n✍️ *Wish:* ${title || ''}`;
        const tgResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text: textMessage, parse_mode: 'Markdown' })
        });
        const tgResult = await tgResponse.json();
        if (tgResult.ok) telegramMessageId = tgResult.result.message_id;
      } catch (tgTextErr) {
        console.error("Telegram Text Failed:", tgTextErr);
      }
    }

    // 3. FIRESTORE DATABASE LOGIC
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

    // 4. REALTIME DATABASE LOGIC
    await rtdb.ref(`wishes/${wishId}`).set({
      likes: 0,
      shares: 0,
      views: 0
    });

    return res.status(200).json({ 
      success: true, 
      message: 'Wish live aur database me sync ho chuki hai!', 
      wishId 
    });

  } catch (error) {
    console.error("Combined Execution Error:", error);
    return res.status(500).json({ success: false, message: `Server Crash Prevented: ${error.message}` });
  }
}
