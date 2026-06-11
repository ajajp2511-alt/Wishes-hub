// Wishes Hub: Simple Admin Controller
document.addEventListener('DOMContentLoaded', () => {
    const unlockBtn = document.getElementById('unlock-btn');
    const loginModule = document.getElementById('login-module');
    const mainPanel = document.getElementById('main-panel');
    const statusText = document.getElementById('status');

    if (unlockBtn) {
        unlockBtn.addEventListener('click', async () => {
            // Aapke HTML ke hisab se exact ID: 'admin-password-field'
            const passwordField = document.getElementById('admin-password-field');
            const enteredPassword = passwordField?.value || "";

            if (!enteredPassword.trim()) {
                if (statusText) statusText.innerText = "🚨 Please enter a password!";
                return;
            }

            if (statusText) statusText.innerText = "🔑 Verifying...";

            try {
                // Direct aapki Vercel API ko hit karega bina kisi jhanjhat ke
                const response = await fetch('/api/verify-pass', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ password: enteredPassword })
                });

                const data = await response.json();

                if (response.ok && data.ok) {
                    // Password sahi hai -> Panel open!
                    if (loginModule) loginModule.style.display = 'none';
                    if (mainPanel) mainPanel.style.display = 'block';
                    console.log("Admin Panel Unlocked!");
                } else {
                    if (statusText) statusText.innerText = "🚨 " + (data.error || "Wrong Password!");
                }
            } catch (error) {
                console.error(error);
                if (statusText) statusText.innerText = "🚨 API Connection Failed!";
            }
        });
    }
});
