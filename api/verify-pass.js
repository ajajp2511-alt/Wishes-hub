export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ message: "Method not allowed" });

    try {
        let body = req.body;
        if (typeof body === 'string') {
            body = JSON.parse(body);
        }

        const { password } = body;
        const SECURE_PASS = process.env.ADMIN_PASSWORD;

        if (!SECURE_PASS) {
            return res.status(500).json({ success: false, message: "Vercel par ADMIN_PASSWORD set nahi hai." });
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
