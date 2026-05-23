// Server-side (Vercel) Code - Tokens yahan chhupaye jayenge
export default async function handler(req, res) {
    const { message, image } = req.body;
    const BOT_TOKEN = process.env.TG_BOT_TOKEN; // .env se uthayega
    const CHAT_ID = process.env.TG_CHAT_ID;

    // Telegram API call logic yahan aayega
    // Isse user ko kabhi bot token nahi dikhega
    res.status(200).json({ success: true, message: "Data Sent to Telegram Securely" });
}
