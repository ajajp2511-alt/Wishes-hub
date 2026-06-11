export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ ok: false });

    try {
        let body = req.body;
        if (typeof body === 'string') body = JSON.parse(body);

        const enteredPassword = body?.password;
        const correctPassword = process.env.ADMIN_PASSWORD;

        if (enteredPassword && enteredPassword.trim() === correctPassword?.trim()) {
            return res.status(200).json({ ok: true });
        } else {
            return res.status(401).json({ ok: false, error: 'Incorrect password!' });
        }
    } catch (error) {
        return res.status(500).json({ ok: false, error: 'Server Error' });
    }
}
