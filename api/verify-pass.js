// api/verify-pass.js
// Wishes Hub: Secure Backend Auth with Body Parser - 2026

export default async function handler(req, res) {
    // CORS Headers setup
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ ok: false, error: 'Method not allowed' });
    }

    try {
        // 🚨 VERCEL FIX: Agar body string form me aayi hai, toh use parse karo
        let body = req.body;
        if (typeof body === 'string') {
            try {
                body = JSON.parse(body);
            } catch (e) {
                console.error("Parsing failed:", e);
            }
        }

        const enteredPassword = body?.password;
        const correctPassword = process.env.ADMIN_PASSWORD;

        if (!correctPassword) {
            return res.status(500).json({ 
                ok: false, 
                error: 'Server error: ADMIN_PASSWORD is not set in Vercel settings!' 
            });
        }

        // 🔒 Dono side ke hidden spaces ko trim karke safe compare karna
        if (enteredPassword && enteredPassword.trim() === correctPassword.trim()) {
            return res.status(200).json({ ok: true });
        } else {
            return res.status(401).json({ ok: false, error: 'Incorrect password!' });
        }
    } catch (error) {
        console.error("Secure Auth Error:", error);
        return res.status(500).json({ ok: false, error: 'Internal Server Error' });
    }
}
