import fetch from 'node-fetch';

// Vercel ko batana padta hai ki body parsing manually handle hogi
export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const token = process.env.TG_BOT_TOKEN; 
    const chatId = process.env.TG_CHAT_ID;  

    try {
        const tgUrl = `https://api.telegram.org/bot${token}/sendPhoto?chat_id=${chatId}`;
        
        // Zaroori: req.headers se sirf 'content-type' pass karein
        // Poore req.headers pass karne se Vercel ke internal headers Telegram ko block kar sakte hain
        const response = await fetch(tgUrl, {
            method: 'POST',
            body: req, // Direct request stream pass karein
            headers: {
                'content-type': req.headers['content-type'],
            }
        });

        const data = await response.json();

        if (data.ok) {
            const fileId = data.result.photo[data.result.photo.length - 1].file_id;
            return res.status(200).json({ ok: true, fileId: fileId });
        } else {
            console.error("Telegram API Refused:", data.description);
            return res.status(400).json({ ok: false, error: data.description });
        }
    } catch (error) {
        console.error("Critical Crash:", error.message);
        return res.status(500).json({ ok: false, error: error.message });
    }
}
