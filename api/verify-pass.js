// Backend: Password Verification
export default async function handler(req, res) {
    // 1. Sirf POST allow karein
    if (req.method !== 'POST') {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        // 2. Vercel automatically body ko object bana deta hai
        // Agar aap JSON.parse(req.body) likhenge toh error aayega
        const { password } = req.body; 
        
        const SECURE_PASS = process.env.ADMIN_PASSWORD;

        // 3. Password Check
        if (password === SECURE_PASS) {
            return res.status(200).json({ 
                success: true, 
                token: "SECURE_SESSION_ACTIVE" 
            });
        } else {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid Credentials" 
            });
        }
    } catch (error) {
        // 4. Emergency Error Catching
        return res.status(500).json({ 
            success: false, 
            message: "Server Error: " + error.message 
        });
    }
}
