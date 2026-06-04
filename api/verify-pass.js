export default async function handler(req, res) {
    // Sabhi tarah ke cache ko block karne ke liye headers
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    if (req.method !== 'POST') return res.status(405).json({ success: false });

    try {
        let data = req.body;
        if (typeof data === 'string') data = JSON.parse(data);

        // Aapka fixed password
        if (data.password === "1234") {
            return res.status(200).json({ success: true });
        } else {
            return res.status(401).json({ success: false, message: "Ghalat Key!" });
        }
    } catch (e) {
        return res.status(500).json({ success: false, error: "Server Error" });
    }
    }
