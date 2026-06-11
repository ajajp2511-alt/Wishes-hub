import formidable from 'formidable';
import fs from 'fs';

// Vercel body parser ko band karna padega taaki heavy streaming files parse ho sakein
export const config = {
    api: { 
        bodyParser: false, 
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

    // Formidable setup - isme koi size limit nahi rakhi taaki heavy videos bhi parse ho sakein
    const form = formidable({ multiplicity: false });

    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(500).json({ success: false, message: "File parsing failed" });
        }

        try {
            // Fields uthana
            const wish = Array.isArray(fields.wish) ? fields.wish[0] : fields.wish;
            
            // File handle karna (chahe photo ho ya video)
            const uploadedFile = Array.isArray(files.mediaFile) ? files.mediaFile[0] : files.mediaFile;
            if (!uploadedFile) {
                return res.status(400).json({ success: false, message: "File select nahi ki gayi hai!" });
            }

            const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
            const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

            // 1. Pata karna ki file Photo hai ya Video/GIF
            const mimeType = uploadedFile.mimetype || '';
            let telegramMethod = 'sendPhoto'; // Default
            let formKey = 'photo';

            if (mimeType.includes('video')) {
                telegramMethod = 'sendVideo';
                formKey = 'video';
            } else if (mimeType.includes('gif')) {
                telegramMethod = 'sendAnimation';
                formKey = 'animation';
            }

            // 2. Telegram ke liye FormData stream banana
            const telegramFormData = new FormData();
            telegramFormData.append('chat_id', CHAT_ID);
            telegramFormData.append('caption', wish);
            telegramFormData.append('parse_mode', 'Markdown');

            // Temporary file path se binary buffer read karna
            const fileBuffer = fs.readFileSync(uploadedFile.filepath);
            const mediaBlob = new Blob([fileBuffer], { type: mimeType });
            
            // Sahi key (photo/video/animation) ke sath file append karna
            telegramFormData.append(formKey, mediaBlob, uploadedFile.originalFilename || 'wish_file');

            // 3. Telegram API hit karna dynamic method ke sath
            const teleUrl = `https://api.telegram.org/bot${BOT_TOKEN}/${telegramMethod}`;
            const teleRes = await fetch(teleUrl, {
                method: 'POST',
                body: telegramFormData
            });

            const teleData = await teleRes.json();

            if (!teleData.ok) {
                return res.status(400).json({ success: false, message: teleData.description });
            }

            // 4. Permanent ID nikalna (Telegram photo ke liye array deta hai, video ke liye object)
            let permanentFileId = '';
            if (formKey === 'photo') {
                permanentFileId = teleData.result.photo[teleData.result.photo.length - 1].file_id;
            } else if (formKey === 'video') {
                permanentFileId = teleData.result.video.file_id;
            } else {
                permanentFileId = teleData.result.animation.file_id;
            }

            const messageId = teleData.result.message_id;

            // Vercel ka storage saaf karne ke liye temporary file delete karna
            fs.unlinkSync(uploadedFile.filepath);

            // Sirf Telegram ke permanent data ka response return karna
            return res.status(200).json({ 
                success: true, 
                fileType: formKey,
                telegramFileId: permanentFileId,
                telegramMessageId: messageId
            });

        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    });
                }
