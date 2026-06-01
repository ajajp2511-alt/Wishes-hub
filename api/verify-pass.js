export default async function handler(req, res) {
    // Sirf POST requests handle karein
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        let body = req.body;
        
        // Vercel par body parsing double-check
        if (typeof body === 'string') {
            try {
                body = JSON.parse(body);
            } catch (e) {
                return res.status(400).json({ success: false, message: "Invalid JSON format" });
            }
        }

        const { password } = body; 
        const SECURE_PASS = process.env.ADMIN_PASSWORD;

        // Security check: Agar environment variable set nahi hai
        if (!SECURE_PASS) {
            return res.status(500).json({ success: false, message: "Server Config Error: Password not set in Vercel." });
        }

        if (password === SECURE_PASS) {
            return res.status(200).json({ success: true });
        } else {
            return res.status(401).json({ success: false, message: "Ghalat Key! Dobara koshish karein." });
        }
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
                }
