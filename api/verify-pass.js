export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    try {
        // Agar req.body string format mein hai, toh use parse karo, nahi toh direct use karo
        let body = req.body;
        if (typeof body === 'string') {
            body = JSON.parse(body);
        }

        const { password } = body; 
        const SECURE_PASS = process.env.ADMIN_PASSWORD;

        // Extra Safety: Check agar password khali toh nahi aa raha
        if (!password || !SECURE_PASS) {
            return res.status(400).json({ success: false, message: "Password config missing or empty!" });
        }

        if (password === SECURE_PASS) {
            return res.status(200).json({ success: true });
        } else {
            return res.status(401).json({ success: false, message: "Ghalat Key!" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}
