// Wishes Hub: Admin Authentication Logic Layer
// Pure Password & Security Verification - 2026

window.verifyAdminPassword = async (adminPassword) => {
    // 1. Basic Local Validation
    if (!adminPassword || !adminPassword.trim()) {
        return { ok: false, error: "Security Error: Please enter the Admin Password!" };
    }

    try {
        // 2. Vercel Backend Password API Check
        const response = await fetch('/api/verify-pass', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password: adminPassword })
        });

        const data = await response.json();
        return data; // Returns backend response: { ok: true } or { ok: false, error: "..." }

    } catch (error) {
        console.error("Auth Layer Network Error:", error);
        return { ok: false, error: "Authentication API Connection Failed!" };
    }
};
