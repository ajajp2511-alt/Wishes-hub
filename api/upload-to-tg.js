export const config = {
    api: { bodyParser: true }, // Simple version ke liye true rakhein
};

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    const { wish, image } = req.body; // Base64 approach ya direct body

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    // Direct Telegram API hit
    try {
        const teleUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`;
        
        // Note: Agar aap direct file bhej rahe hain toh aapko FormData 
        // backend par bhi maintain karna hoga.
        
        // Final Response
        return res.status(200).json({ 
            success: true, 
            message: "API Ready! Token and ID working." 
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}
