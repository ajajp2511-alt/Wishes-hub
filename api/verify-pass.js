// api/verify-pass.js
// Wishes Hub: Pure Node Backend Password Verification - 2026

export default async function handler(req, res) {
    // Enable CORS taaki frontend safely connect kar sake
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
        const { password } = req.body;
        // Read password from Vercel Environment Variables
        const correctPassword = process.env.ADMIN_PASSWORD;

        if (!correctPassword) {
            return res.status(500).json({ 
                ok: false, 
                error: 'Server variable ADMIN_PASSWORD is missing in Vercel settings!' 
            });
        }

        if (password === correctPassword) {
            return res.status(200).json({ ok: true });
        } else {
            return res.status(401).json({ ok: false, error: 'Incorrect password!' });
        }
    } catch (error) {
        console.error("Backend Auth Error:", error);
        return res.status(500).json({ ok: false, error: 'Internal Server Error' });
    }
}
