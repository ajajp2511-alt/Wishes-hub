export default async function handler(req, res) {
    // Sirf POST request allow karein
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        // Vercel body parsing safety check
        let body = req.body;
        if (typeof body === 'string') {
            try {
                body = JSON.parse(body);
            } catch (e) {
                return res.status(400).json({ success: false, message: "Invalid JSON format" });
            }
        }

        const { password } = body; 
        const SECURE_PASS = process.env.ADMIN_PASSWORD;

        // Check agar password match hota hai
        if (password === SECURE_PASS) {
            return res.status(200).json({ success: true });
        } else {
            return res.status(401).json({ success: false, message: "Ghalat Key!" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}
