export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ success: false });

    try {
        // Mobile browsers ke liye extra check
        let data = req.body;
        if (typeof data === 'string') {
            data = JSON.parse(data);
        }

        const { password } = data;
        const SECURE_PASS = process.env.ADMIN_PASSWORD;

        if (!SECURE_PASS) {
            return res.status(500).json({ success: false, message: "Vercel variable missing" });
        }

        if (password === SECURE_PASS) {
            return res.status(200).json({ success: true });
        } else {
            return res.status(401).json({ success: false, message: "Ghalat Key!" });
        }
    } catch (e) {
        return res.status(500).json({ success: false, error: e.message });
    }
}
