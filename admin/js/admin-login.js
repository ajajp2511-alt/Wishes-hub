// ==========================================================
// 🛡️ WISHES HUB ADMIN - LOGIN LOGIC ENGINE (REFRESH TO LOCK)
// ==========================================================

document.addEventListener('DOMContentLoaded', () => {
    const passwordField = document.getElementById('admin-password-field');
    const unlockBtn = document.getElementById('unlock-btn');
    const statusText = document.getElementById('status');

    // Agar pehle se logged in hai (usi session me), toh check karein
    if (sessionStorage.getItem('isAdminLoggedIn') === 'true') {
        window.location.href = "/admin/index.html";
        return;
    }

    // Login function ko handle karne ke liye core logic
    async function handleLogin() {
        const password = passwordField.value.trim();

        if (!password) {
            showStatus("⚠️ Please enter a password!", "error");
            return;
        }

        showStatus("⏳ Verifying...", "processing");

        try {
            // Backend API verification call
            const response = await fetch('/api/verify-pass', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ password: password })
            });

            const data = await response.json();

            if (response.status === 200 && data.success) {
                showStatus("🎉 Access Granted! Redirecting...", "success");
                
                // 🔴 APNA LOGIC: localStorage ki jagah sessionStorage use kiya
                sessionStorage.setItem('isAdminLoggedIn', 'true');
                
                // 1 second baad dashboard par redirect karein
                setTimeout(() => {
                    window.location.href = "/admin/index.html";
                }, 1000);
            } else {
                showStatus(`❌ ${data.message || 'Incorrect Password!'}`, "error");
            }
        } catch (error) {
            console.error("Login Error:", error);
            showStatus("🚨 Network Error! Backend connect nahi ho pa raha hai.", "error");
        }
    }

    // Status message dikhane ka function
    function showStatus(message, type) {
        statusText.innerText = message;
        if (type === "success") statusText.style.color = "var(--success)";
        if (type === "error") statusText.style.color = "var(--danger)";
        if (type === "processing") statusText.style.color = "var(--primary)";
    }

    // Button click aur Enter key listeners
    if (unlockBtn) unlockBtn.addEventListener('click', handleLogin);
    if (passwordField) {
        passwordField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleLogin();
        });
    }
});
