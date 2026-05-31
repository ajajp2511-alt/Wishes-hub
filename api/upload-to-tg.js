import fetch from 'node-fetch';

export const config = {
    api: {
        bodyParser: false, // Zaroori: Iske bina image corrupt ho jayegi
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

    const token = process.env.TG_BOT_TOKEN; 
    const chatId = process.env.TG_CHAT_ID;  

    try {
        const tgUrl = `https://api.telegram.org/bot${token}/sendPhoto?chat_id=${chatId}`;
        
        const response = await fetch(tgUrl, {
            method: 'POST',
            body: req, // Direct stream
            headers: {
                'content-type': req.headers['content-type'],
            }
        });

        const data = await response.json();

        if (data.ok) {
            const fileId = data.result.photo[data.result.photo.length - 1].file_id;
            res.status(200).json({ ok: true, fileId: fileId });
        } else {
            res.status(400).json({ ok: false, error: data.description });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
