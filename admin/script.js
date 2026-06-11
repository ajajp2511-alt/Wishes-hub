// Wishes Hub: Live Admin Controller
document.addEventListener('DOMContentLoaded', () => {
    const unlockBtn = document.getElementById('unlock-btn');
    const loginModule = document.getElementById('login-module');
    const mainPanel = document.getElementById('main-panel');
    const statusText = document.getElementById('status');

    if (unlockBtn) {
        unlockBtn.addEventListener('click', async () => {
            const passwordField = document.getElementById('admin-password-field');
            const enteredPassword = passwordField?.value || "";

            if (!enteredPassword.trim()) {
                if (statusText) statusText.innerText = "🚨 Please enter a password!";
                return;
            }

            if (statusText) statusText.innerText = "🔑 Connecting to server...";

            try {
                // strict slash ke sath function block invocation
                const response = await fetch('/api/verify-pass', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ password: enteredPassword })
                });

                const data = await response.json().catch(() => ({}));

                if (response.status === 200) {
                    if (statusText) statusText.innerText = "";
                    if (loginModule) loginModule.style.display = 'none';
                    if (mainPanel) mainPanel.style.display = 'block';
                    console.log("Admin Panel Unlocked!");
                } else {
                    if (statusText) statusText.innerText = "🚨 Access Denied: " + (data.error || "Wrong Password!");
                }
            } catch (error) {
                console.error(error);
                if (statusText) statusText.innerText = "🚨 Connection Failed!";
            }
        });
    }
});
