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
        // Mobile par cache bypass karne ke liye timestamp (?v=...)
        const apiUrl = `${window.location.origin}/api/verify-pass?v=${Date.now()}`;
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: passInput.value.trim() })
        });

        const result = await response.json();

        if (response.ok && result.success) {
            localStorage.setItem("admin_auth_status", "active");
            // Direct panel dikhao bina page reload ke
            document.getElementById('login-module').style.display = 'none';
            document.getElementById('main-panel').style.display = 'block';
            statusDiv.innerText = "✅ Unlocked!";
        } else {
            statusDiv.style.color = "#f85149";
            statusDiv.innerText = "❌ " + (result.message || "Ghalat Key");
        }
    } catch (err) {
        statusDiv.innerText = "❌ Connection Fail!";
        alert("API tak request nahi pahunch rahi. GitHub commit ke baad 1-2 minute rukiye.");
    } finally {
        btn.disabled = false;
        btn.innerText = "Unlock System";
    }
}

// Ye function hamesha check karega agar pehle se login hai
function checkAuth() {
    if (localStorage.getItem("admin_auth_status") === "active") {
        document.getElementById('login-module').style.display = 'none';
        document.getElementById('main-panel').style.display = 'block';
    }
}

function logout() {
    localStorage.removeItem("admin_auth_status");
    window.location.reload();
}

document.addEventListener("DOMContentLoaded", checkAuth);
window.verifyMasterPassword = verifyMasterPassword;
window.logout = logout;
