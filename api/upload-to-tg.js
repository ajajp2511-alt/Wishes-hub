// Patel Studio - Backend API for Telegram Upload
const fetch = require('node-fetch');
const FormData = require('form-data');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const token = process.env.TG_BOT_TOKEN; // Vercel Dashboard se aayega
    const chatId = process.env.TG_CHAT_ID;  // Aapka Chat ID jahan photo jayegi

    try {
        // Form data ko parse karne ke liye (Simple setup for Vercel)
        const response = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
            method: 'POST',
            body: req.body, // Direct forwarding from admin panel
            headers: req.headers
        });

        const data = await response.json();

        if (data.ok) {
            // Sabse badi size wali photo ki file_id nikalna
            const fileId = data.result.photo[data.result.photo.length - 1].file_id;
            res.status(200).json({ ok: true, fileId: fileId });
        } else {
            res.status(400).json({ ok: false, error: data.description });
        }
    } catch (error) {
        res.status(500).json({ error: "Server Error: " + error.message });
    }
    }
