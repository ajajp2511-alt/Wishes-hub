const axios = require('axios');

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const { fileData, type, fileName } = req.body;
    const TG_TOKEN = process.env.TG_BOT_TOKEN;
    const TG_CHAT = process.env.TG_CHAT_ID;
    
    const method = type === 'hd' ? 'sendDocument' : 'sendPhoto';

    try {
        const response = await axios.post(`https://api.telegram.org/bot${TG_TOKEN}/${method}`, {
            chat_id: TG_CHAT,
            [type === 'hd' ? 'document' : 'photo']: fileData,
            caption: fileName
        });
        
        const result = response.data.result;
        const fileId = type === 'hd' ? result.document.file_id : result.photo.pop().file_id;
        
        res.status(200).json({ success: true, fileId: fileId });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}
