// api/verify-pass.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ ok: false, error: 'Method not allowed' });
    }

    try {
        const { password } = req.body;
        const correctPassword = process.env.ADMIN_PASSWORD;

        if (!correctPassword) {
            return res.status(500).json({ ok: false, error: 'Server configuration error: Password not set in environment variables.' });
        }

        if (password === correctPassword) {
            return res.status(200).json({ ok: true });
        } else {
            return res.status(401).json({ ok: false, error: 'Incorrect password!' });
        }
    } catch (error) {
        return res.status(500).json({ ok: false, error: 'Internal Server Error' });
    }
}
