// api/verify-pass.js
// Wishes Hub: Strict Dashboard Variable Match - 2026

export default async function handler(req, res) {
    // Basic Headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ ok: false });

    try {
        // Safe incoming data parsing
        let body = req.body;
        if (typeof body === 'string') {
            body = JSON.parse(body);
        }

        const enteredPassword = body?.password ? String(body.password).trim() : '';
        
        // 🔒 Strictly reading from your Vercel Project Settings Dashboard
        const correctPassword = process.env.ADMIN_PASSWORD ? String(process.env.ADMIN_PASSWORD).trim() : '';

        // Debugging validation
        if (!correctPassword) {
            return res.status(500).json({ ok: false, error: "Server Configuration Error" });
        }

        if (enteredPassword === correctPassword) {
            return res.status(200).json({ ok: true });
        } else {
            return res.status(401).json({ ok: false, error: 'Incorrect password!' });
        }
    } catch (error) {
        return res.status(500).json({ ok: false, error: 'Server Error' });
    }
}
