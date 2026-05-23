// Feature: Admin Session Security
function checkAdminAuth() {
    const session = localStorage.getItem('adminToken');
    if (!session) {
        window.location.href = "login.html"; // Agar login nahi hai toh bahar bhej do
    }
}

async function loginAdmin(pass) {
    // .env wali key se match karega (via API)
    const response = await fetch('/api/verify-pass', {
        method: 'POST',
        body: JSON.stringify({ password: pass })
    });
    const result = await response.json();
    if (result.success) {
        localStorage.setItem('adminToken', 'active');
        window.location.reload();
    }
}
