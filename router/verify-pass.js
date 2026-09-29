// api/verify-pass.js
// Wishes Hub: Direct Dedicated API Route - 2026

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method Not Allowed' });

    try {
        let body = req.body;
        if (typeof body === 'string') {
            body = JSON.parse(body);
        }

        const enteredPassword = body?.password ? String(body.password).replace(/\s+/g, '') : '';
        
        let correctPassword = process.env.ADMIN_PASSWORD ? String(process.env.ADMIN_PASSWORD) : '';
        correctPassword = correctPassword.replace(/\s+/g, '');

        if (!correctPassword) {
            return res.status(500).json({ ok: false, error: "Server Configuration Error: ADMIN_PASSWORD missing" });
        }

        if (enteredPassword === correctPassword) {
            return res.status(200).json({ ok: true });
        } else {
            return res.status(401).json({ ok: false, error: 'Incorrect password!' });
        }
    } catch (error) {
        console.error("Verify Pass Error:", error);
        return res.status(500).json({ ok: false, error: 'Server Error' });
    }
                                                  }
