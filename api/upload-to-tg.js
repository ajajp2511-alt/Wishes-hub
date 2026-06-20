// api/upload-to-tg.js

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ success: false });

    try {
        const { title, category, sub_category, image } = req.body;
        const botToken = process.env.TG_BOT_TOKEN;
        const chatId = process.env.TG_CHAT_ID;

        const textMessage = `📌 *Category:* ${category}\n📁 *Sub-Category:* ${sub_category}\n\n✍️ *Wish:* ${title}`;
        
        if (image) {
            // Dynamic content type checker (JPG, PNG, GIF sab ke liye)
            const mimeMatch = image.match(/^data:(image\/\w+);base64,/);
            const contentType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
            const ext = contentType.split('/')[1] || 'jpg';

            const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
            const buffer = Buffer.from(base64Data, 'base64');
            
            const boundary = `----WebKitFormBoundary${Math.random().toString(36).substring(2)}`;
            
            // GIF/Animation ke liye sendAnimation use karna padta hai, baki ke liye sendPhoto
            const isGif = contentType.includes('gif');
            const telegramUrl = `https://api.telegram.org/bot${botToken}/${isGif ? 'sendAnimation' : 'sendPhoto'}`;
            const mediaParamName = isGif ? 'animation' : 'photo';

            const parts = [
                `--${boundary}\r\nContent-Disposition: form-data; name="chat_id"\r\n\r\n${chatId}\r\n`,
                `--${boundary}\r\nContent-Disposition: form-data; name="caption"\r\n\r\n${textMessage}\r\n`,
                `--${boundary}\r\nContent-Disposition: form-data; name="parse_mode"\r\n\r\nMarkdown\r\n`,
                `--${boundary}\r\nContent-Disposition: form-data; name="${mediaParamName}"; filename="wish_media.${ext}"\r\nContent-Type: ${contentType}\r\n\r\n`
            ];

            const headerBuffer = Buffer.from(parts.join(''), 'utf-8');
            const footerBuffer = Buffer.from(`\r\n--${boundary}--\r\n`, 'utf-8');
            const multipartBody = Buffer.concat([headerBuffer, buffer, footerBuffer]);

            const response = await fetch(telegramUrl, {
                method: 'POST',
                headers: { 'Content-Type': `multipart/form-data; boundary=${boundary}` },
                body: multipartBody
            });

            const tgResult = await response.json();
            
            if (tgResult.ok) {
                let fileId = null;
                
                // Extracting valid file identifier
                if (isGif && tgResult.result.animation) {
                    fileId = tgResult.result.animation.file_id;
                } else if (tgResult.result.photo) {
                    const photos = tgResult.result.photo;
                    fileId = photos[photos.length - 1].file_id;
                }

                // Fallback check: website par load karne ke liye safe file link fetch strategy
                let fileUrl = null;
                if (fileId) {
                    try {
                        const fileInfoRes = await fetch(`https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`);
                        const fileInfo = await fileInfoRes.json();
                        if (fileInfo.ok) {
                            fileUrl = `https://api.telegram.org/file/bot${botToken}/${fileInfo.result.file_path}`;
                        }
                    } catch (e) {
                        console.error("Path extraction failed, assigning fallback ID reference");
                    }
                }

                return res.status(200).json({ 
                    success: true, 
                    message_id: tgResult.result.message_id, 
                    fileUrl: fileUrl,
                    telegramFileId: fileId, // Backup file reference
                    fileType: isGif ? 'animation' : 'photo'
                });
            } else {
                return res.status(400).json({ success: false, error: tgResult.description });
            }
        } else {
            const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: chatId, text: textMessage, parse_mode: 'Markdown' })
            });
            const tgResult = await response.json();
            if (tgResult.ok) return res.status(200).json({ success: true, message_id: tgResult.result.message_id });
        }

        return res.status(400).json({ success: false, error: 'Telegram processing encountered an issue.' });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}
