// api/upload-to-tg.js

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ success: false });

    try {
        const { title, category, sub_category, image } = req.body;
        const botToken = process.env.TG_BOT_TOKEN;
        const chatId = process.env.TG_CHAT_ID;

        const textMessage = `📌 *Category:* ${category}\n📁 *Sub-Category:* ${sub_category}\n\n✍️ *Wish:* ${title}`;
        let response;
        let fileUrl = null;

        if (image) {
            const telegramUrl = `https://api.telegram.org/bot${botToken}/sendPhoto`;
            const base64Data = image.split(',')[1];
            const buffer = Buffer.from(base64Data, 'base64');
            const boundary = `----WebKitFormBoundary${Math.random().toString(36).substring(2)}`;
            
            const parts = [
                `--${boundary}\r\nContent-Disposition: form-data; name="chat_id"\r\n\r\n${chatId}\r\n`,
                `--${boundary}\r\nContent-Disposition: form-data; name="caption"\r\n\r\n${textMessage}\r\n`,
                `--${boundary}\r\nContent-Disposition: form-data; name="parse_mode"\r\n\r\nMarkdown\r\n`,
                `--${boundary}\r\nContent-Disposition: form-data; name="photo"; filename="wish_image.jpg"\r\nContent-Type: image/jpeg\r\n\r\n`
            ];

            const headerBuffer = Buffer.from(parts.join(''), 'utf-8');
            const footerBuffer = Buffer.from(`\r\n--${boundary}--\r\n`, 'utf-8');
            const multipartBody = Buffer.concat([headerBuffer, buffer, footerBuffer]);

            response = await fetch(telegramUrl, {
                method: 'POST',
                headers: { 'Content-Type': `multipart/form-data; boundary=${boundary}` },
                body: multipartBody
            });

            const tgResult = await response.json();
            
            if (tgResult.ok) {
                // Telegram array me multiple sizes deta hai, hum sabse badhi image (last element) ka file_id uthayenge
                const photos = tgResult.result.photo;
                const fileId = photos[photos.length - 1].file_id;

                // File path nikalne ke liye request
                const fileInfoRes = await fetch(`https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`);
                const fileInfo = await fileInfoRes.json();
                
                if (fileInfo.ok) {
                    fileUrl = `https://api.telegram.org/file/bot${botToken}/${fileInfo.result.file_path}`;
                }
                
                return res.status(200).json({ success: true, message_id: tgResult.result.message_id, fileUrl });
            }
        } else {
            // Text only message logic...
            response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: chatId, text: textMessage, parse_mode: 'Markdown' })
            });
            const tgResult = await response.json();
            if (tgResult.ok) return res.status(200).json({ success: true, message_id: tgResult.result.message_id, fileUrl: null });
        }

        return res.status(400).json({ success: false, error: 'Telegram dispatch failed' });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}
