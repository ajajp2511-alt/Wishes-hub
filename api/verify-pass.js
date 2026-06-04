export default async function handler(req, res) {
    // 1. Sirf POST allow karein
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: "Method Not Allowed" });
    }

    try {
        // 2. Body parsing safety
        let data = req.body;
        if (typeof data === 'string') {
            data = JSON.parse(data);
        }

        const { password } = data;
        const SECURE_PASS = process.env.ADMIN_PASSWORD;

        // 3. Check if Environment Variable exists
        if (!SECURE_PASS) {
            console.error("Vercel Error: ADMIN_PASSWORD is not set in Environment Variables.");
            return res.status(500).json({ success: false, message: "Server configuration missing." });
        }

        // 4. Password matching
        if (password === SECURE_PASS) {
            return res.status(200).json({ success: true });
        } else {
            return res.status(401).json({ success: false, message: "Ghalat Key! Dobara koshish karein." });
        }

    } catch (error) {
        console.error("Auth Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
}
