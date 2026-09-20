/**
 * Auth Verifier Module
 * Path: admin/features/auth-security/modules/auth-verifier.js
 */

export async function verifyAdminPassword(adminPassword) {
    if (!adminPassword || !adminPassword.trim()) {
        return { ok: false, error: "Security Error: Please enter the Admin Password!" };
    }

    try {
        const response = await fetch('/api/verify-pass', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password: adminPassword })
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            return { ok: false, error: errData.error || `Server Error (${response.status})` };
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Auth Layer Network Error:", error);
        return { ok: false, error: "Authentication API Connection Failed! Check Vercel routing." };
    }
}
