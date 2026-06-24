// Wishes Hub: Login Handler (Updated Name to Avoid Conflict)
document.addEventListener('DOMContentLoaded', () => {
    const unlockBtn = document.getElementById('unlock-btn');
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
                const response = await fetch('/api/verify-pass', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ password: enteredPassword })
                });

                const data = await response.json().catch(() => ({}));

                if (response.status === 200) {
                    if (statusText) statusText.innerText = "🔑 Success! Redirecting...";
                    
                    // Session save kiya taaki index.html access mil sake
                    localStorage.setItem('isAdminLoggedIn', 'true');

                    // Dashboard (index.html) par redirect
                    setTimeout(() => {
                        window.location.href = "/admin/index.html";
                    }, 500);

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
