async function verifyMasterPassword() {
    const passInput = document.getElementById('admin-pass');
    const statusDiv = document.getElementById('status');
    const btn = document.getElementById('auth-btn');

    if (!passInput.value) {
        alert("Password daalein!");
        return;
    }

    btn.disabled = true;
    btn.innerText = "⏳ Checking...";
    statusDiv.innerText = "";

    try {
        // ?cb=${Date.now()} browser ko hamesha naya data load karne par majboor karta hai
        const apiUrl = `${window.location.origin}/api/verify-pass?cb=${Date.now()}`;
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: passInput.value.trim() })
        });

        const result = await response.json();

        if (response.ok && result.success) {
            localStorage.setItem("admin_auth_status", "active");
            // UI Update
            document.getElementById('login-module').style.display = 'none';
            document.getElementById('main-panel').style.display = 'block';
            statusDiv.innerText = "✅ Unlocked!";
        } else {
            statusDiv.style.color = "#f85149";
            statusDiv.innerText = "❌ " + (result.message || "Ghalat Key");
        }
    } catch (err) {
        statusDiv.innerText = "❌ API error! Deployments check karein.";
        alert("Connection failed. Check if Vercel build is complete.");
    } finally {
        btn.disabled = false;
        btn.innerText = "Unlock System";
    }
}

function checkAuth() {
    if (localStorage.getItem("admin_auth_status") === "active") {
        document.getElementById('login-module').style.display = 'none';
        document.getElementById('main-panel').style.display = 'block';
    }
}

document.addEventListener("DOMContentLoaded", checkAuth);
window.verifyMasterPassword = verifyMasterPassword;
