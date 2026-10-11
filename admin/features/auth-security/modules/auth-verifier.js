/**
 * Auth Verifier Module (Optimized with Timeout & Safe Response)
 * Path: admin/features/auth-security/modules/auth-verifier.js
 */

export async function verifyAdminPassword(adminPassword) {
    if (!adminPassword || !adminPassword.trim()) {
        return { ok: false, error: "Security Error: Please enter the Admin Password!" };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout

    try {
        const response = await fetch('/api/verify-pass', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password: adminPassword }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            return { ok: false, error: data.error || `Server Error (${response.status})` };
        }

        return data;

    } catch (error) {
        clearTimeout(timeoutId);
        console.error("Auth Layer Network Error:", error);
        
        if (error.name === 'AbortError') {
            return { ok: false, error: "Authentication Request Timed Out. Please check your network." };
        }
        
        return { ok: false, error: "Authentication API Connection Failed! Check Vercel routing." };
    }
}
