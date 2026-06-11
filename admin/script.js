// Wishes Hub: Live Admin Controller - 2026

document.addEventListener('DOMContentLoaded', () => {
    const unlockBtn = document.getElementById('unlock-btn');
    const loginModule = document.getElementById('login-module');
    const mainPanel = document.getElementById('main-panel');
    const statusText = document.getElementById('status');

    console.log("Admin System Status: Event Listeners Initializing...");

    if (unlockBtn) {
        unlockBtn.addEventListener('click', async () => {
            // Target the password input using the exact ID from your HTML
            const passwordField = document.getElementById('admin-password-field');
            const enteredPassword = passwordField?.value || "";

            if (!enteredPassword.trim()) {
                if (statusText) statusText.innerText = "🚨 Please enter a password!";
                return;
            }

            if (statusText) statusText.innerText = "🔑 Connecting to server...";

            try {
                // Direct call to your Vercel Node serverless function
                const response = await fetch('/api/verify-pass', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json' 
                    },
                    body: JSON.stringify({ password: enteredPassword })
                });

                // Check if the response is completely valid
                if (!response.ok) {
                    if (statusText) statusText.innerText = `🚨 Server Error (${response.status})`;
                    return;
                }

                const data = await response.json();

                if (data && data.ok === true) {
                    // Success: Clear status, hide login, show main panel dashboard
                    if (statusText) statusText.innerText = "";
                    if (loginModule) loginModule.style.display = 'none';
                    if (mainPanel) mainPanel.style.display = 'block';
                    
                    console.log("Access Granted: Welcome back, Admin.");
                } else {
                    // Password was processed but rejected by your backend logic
                    if (statusText) statusText.innerText = "🚨 Access Denied: " + (data.error || "Invalid Password!");
                }
            } catch (error) {
                console.error("Network Fetch Exception:", error);
                if (statusText) statusText.innerText = "🚨 Connection Failed: Check API availability.";
            }
        });
    } else {
        console.error("Critical HTML Error: Element '#unlock-btn' not found in DOM.");
    }
});
