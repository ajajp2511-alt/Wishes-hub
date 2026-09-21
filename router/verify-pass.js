// api/verify-pass.js
// Wishes Hub: Double-Trim Sync Fix - 2026

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ ok: false });

    try {
        let body = req.body;
        if (typeof body === 'string') {
            body = JSON.parse(body);
        }

        // Frontend se aaya hua password (Trimming space)
        const enteredPassword = body?.password ? String(body.password).replace(/\s+/g, '') : '';
        
        // Dashboard se aaya hua password (Force String + Heavy Trimming space)
        let correctPassword = process.env.ADMIN_PASSWORD ? String(process.env.ADMIN_PASSWORD) : '';
        correctPassword = correctPassword.replace(/\s+/g, ''); // Kisi bhi hidden space ko poora saaf karne ke liye

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
