// ==========================================================
// 🛡️ WISHES HUB ADMIN - LOGIN LOGIC ENGINE (SMART VERIFY)
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
        const password = passwordField.value.trim(); // Extra spaces hata dega

        if (!password) {
            showStatus("⚠️ Please enter a password!", "error");
            return;
        }

        showStatus("⏳ Verifying...", "processing");

        try {
            console.log("Sending password check request...");
            
            // Backend API verification call
            const response = await fetch('/api/verify-pass', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ password: password })
            });

            // Yahan hum response text nikal rahe hain pehle taaki error check ho sake
            const responseText = await response.text();
            console.log("Raw Server Response:", responseText);

            // Text ko JSON me convert karenge safely
            let data = {};
            try {
                data = JSON.parse(responseText);
            } catch (e) {
                console.warn("Response was not strict JSON, evaluating status code instead.");
            }

            // 🔴 APNA SMART LOGIC: Agar status 200 hai YA data.success true hai
            if (response.status === 200 || data.success === true) {
                showStatus("🎉 Access Granted! Redirecting...", "success");
                
                // Session store kiya
                sessionStorage.setItem('isAdminLoggedIn', 'true');
                
                // 1 second baad dashboard par redirect karein
                setTimeout(() => {
                    window.location.href = "/admin/index.html";
                }, 1000);
            } else {
                // Agar galat bataye toh message dikhao
                showStatus(`❌ ${data.message || 'Incorrect Password!'}`, "error");
            }
        } catch (error) {
            console.error("Login Error Details:", error);
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
