import fetch from 'node-fetch';
import FormData from 'form-data';

export default async function handler(req, res) {
    // Sirf POST requests allow karein
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const token = process.env.TG_BOT_TOKEN; 
    const chatId = process.env.TG_CHAT_ID;  

    try {
        // Telegram API ko photo forward karna
        // chat_id ko URL query mein daalna secure hai
        const tgUrl = `https://api.telegram.org/bot${token}/sendPhoto?chat_id=${chatId}`;
        
        const response = await fetch(tgUrl, {
            method: 'POST',
            body: req.body, 
            headers: req.headers // Admin panel se aane wale multi-part headers
        });

        const data = await response.json();

        if (data.ok) {
            // Photo array se sabse HD quality (last index) wali file_id nikalna
            const fileId = data.result.photo[data.result.photo.length - 1].file_id;
            res.status(200).json({ ok: true, fileId: fileId });
        } else {
            console.error("Telegram Error:", data.description);
            res.status(400).json({ ok: false, error: data.description });
        }
    } catch (error) {
        console.error("Server Crash:", error.message);
        res.status(500).json({ error: "Server Error: " + error.message });
    }
}
