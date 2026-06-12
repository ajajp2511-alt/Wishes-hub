export async function verifyAdminPassword(password) {
    try {
        const response = await fetch('/api/verify-pass', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });
        return response.ok;
    } catch (err) {
        return false;
    }
}
