export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    try {
        // Vercel auto-parse karta hai, isliye JSON.parse mat likhna
        const { password } = req.body; 
        const SECURE_PASS = process.env.ADMIN_PASSWORD;

        if (password === SECURE_PASS) {
            return res.status(200).json({ success: true });
        } else {
            return res.status(401).json({ success: false, message: "Ghalat Key!" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}
