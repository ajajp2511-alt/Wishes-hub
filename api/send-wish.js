// Wishes-hub/api/send-wish.js

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { category, wishText, animId } = req.body;

        // Vercel dashboard se tokens load honge
        const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
        const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

        const telegramMessage = `
🌟 *New Wish Category Added!* 🌟
--------------------------------
📂 *Category:* ${category}
✨ *Auto-Animation ID:* \`${animId}\`
📝 *Wish Text:* "${wishText}"

🕒 _Timestamp: ${new Date().toLocaleString()}_
`;

        const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

        const telegramResponse = await fetch(telegramUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: telegramMessage,
                parse_mode: "Markdown"
            })
        });

        const result = await telegramResponse.json();

        if (result.ok) {
            return res.status(200).json({ success: true, message: 'Telegram par bhej diya gya!' });
        } else {
            return res.status(500).json({ success: false, error: result });
        }

    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}
