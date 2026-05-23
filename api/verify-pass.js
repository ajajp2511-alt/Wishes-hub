// Backend: Password Verification
export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    const { password } = JSON.parse(req.body);
    const SECURE_PASS = process.env.ADMIN_PASSWORD; // .env se password match

    if (password === SECURE_PASS) {
        return res.status(200).json({ success: true, token: "SECURE_SESSION_ACTIVE" });
    } else {
        return res.status(401).json({ success: false, message: "Invalid Credentials" });
    }
}
