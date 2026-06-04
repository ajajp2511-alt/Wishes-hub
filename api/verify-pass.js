export default async function handler(req, res) {
    // Force bypass every possible cache
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Content-Type', 'application/json');

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: "Method not allowed" });
    }

    try {
        let body = req.body;
        // Mobile compatibility parsing
        if (typeof body === 'string') {
            body = JSON.parse(body);
        }

        const { password } = body;

        // Aapka fixed password
        if (password === "1234") {
            return res.status(200).json({ success: true });
        } else {
            return res.status(401).json({ success: false, message: "Ghalat Key!" });
        }
    } catch (e) {
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}
