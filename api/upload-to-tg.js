// api/upload-to-tg.js

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method Not Allowed' });
    }

    try {
        const { title, category, sub_category, image } = req.body;
        
        // 🔑 FIXED: Variables matching your Vercel Dashboard exactly
        const botToken = process.env.TG_BOT_TOKEN;
        const chatId = process.env.TG_CHAT_ID;

        if (!botToken || !chatId) {
            return res.status(500).json({ success: false, error: 'Telegram credentials missing in Vercel Environment variables.' });
        }

        // Beautiful format for Telegram Channel
        const textMessage = `📌 *Category:* ${category}\n📁 *Sub-Category:* ${sub_category}\n\n✍️ *Wish:* ${title}`;

        let response;

        if (image) {
            // 📸 Case 1: Image ke sath sendPhoto send karna hai
            const telegramUrl = `https://api.telegram.org/bot${botToken}/sendPhoto`;
            
            // Base64 data se meta data alag karke buffer banana
            const base64Data = image.split(',')[1];
            const buffer = Buffer.from(base64Data, 'base64');

            // Multi-part form-data stream manual creation for Vercel Serverless environment
            const boundary = `----WebKitFormBoundary${Math.random().toString(36).substring(2)}`;
            
            // Form pieces build karna
            let parts = [
                `--${boundary}\r\nContent-Disposition: form-data; name="chat_id"\r\n\r\n${chatId}\r\n`,
                `--${boundary}\r\nContent-Disposition: form-data; name="caption"\r\n\r\n${textMessage}\r\n`,
                `--${boundary}\r\nContent-Disposition: form-data; name="parse_mode"\r\n\r\nMarkdown\r\n`,
                `--${boundary}\r\nContent-Disposition: form-data; name="photo"; filename="wish_image.jpg"\r\nContent-Type: image/jpeg\r\n\r\n`
            ];

            // Buffer concatenation for sending binary data safely
            const headerBuffer = Buffer.from(parts.join(''), 'utf-8');
            const footerBuffer = Buffer.from(`\r\n--${boundary}--\r\n`, 'utf-8');
            const multipartBody = Buffer.concat([headerBuffer, buffer, footerBuffer]);

            response = await fetch(telegramUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': `multipart/form-data; boundary=${boundary}`,
                    'Content-Length': multipartBody.length
                },
                body: multipartBody
            });

        } else {
            // ✍️ Case 2: Only text upload structure
            const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
            
            response = await fetch(telegramUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: textMessage,
                    parse_mode: 'Markdown'
                })
            });
        }

        const tgResult = await response.json();
        
        if (tgResult.ok) {
            return res.status(200).json({ success: true, message_id: tgResult.result.message_id });
        } else {
            return res.status(400).json({ success: false, error: tgResult.description });
        }

    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}
