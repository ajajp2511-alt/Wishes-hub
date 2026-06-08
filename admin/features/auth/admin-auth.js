// Wishes Hub: Admin Authentication Logic Layer
// Pure Password & Security Verification - 2026

window.verifyAdminPassword = async (adminPassword) => {
    if (!adminPassword || !adminPassword.trim()) {
        return { ok: false, error: "Security Error: Please enter the Admin Password!" };
    }

    try {
        // Path ko exact structure par update kiya
        const response = await fetch('/api/verify-pass', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password: adminPassword })
        });

        // Agar server 404 ya 500 error de raha ho
        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            return { ok: false, error: errData.error || `Server Error (${response.status})` };
        }

        const data = await response.json();
        return data; // Expected: { ok: true } ya { ok: false, error: "..." }

    } catch (error) {
        console.error("Auth Layer Network Error:", error);
        return { ok: false, error: "Authentication API Connection Failed! Check Vercel routing." };
    }
};
