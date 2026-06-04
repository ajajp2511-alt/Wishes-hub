export default async function handler(req, res) {
    // Cache ko puri tarah se rokne ke liye headers
    res.setHeader('Cache-Control', 'no-store, max-age=0, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    
    if (req.method !== 'POST') return res.status(405).json({ success: false });

    try {
        let data = req.body;
        if (typeof data === 'string') data = JSON.parse(data);

        const { password } = data;
        const SECURE_PASS = "1234"; // Aapka password

        if (password === SECURE_PASS) {
            return res.status(200).json({ success: true });
        } else {
            return res.status(401).json({ success: false, message: "Ghalat Key!" });
        }
    } catch (e) {
        return res.status(500).json({ success: false, error: e.message });
    }
}
