async function verifyMasterPassword() {
    const passInput = document.getElementById('admin-pass');
    const statusDiv = document.getElementById('status');
    const btn = document.getElementById('auth-btn');

    if (!passInput.value) return alert("Password daalein!");

    btn.disabled = true;
    btn.innerText = "⏳ Checking...";
    statusDiv.innerText = "";

    try {
        // Path logic fix for Mobile & Vercel
        const response = await fetch('/api/verify-pass', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: passInput.value.trim() })
        });

        const result = await response.json();

        if (response.ok && result.success) {
            localStorage.setItem("admin_auth_status", "active");
            // UI Switch (Bina reload ke)
            document.getElementById('login-module').style.display = 'none';
            document.getElementById('main-panel').style.display = 'block';
            statusDiv.innerHTML = "<span style='color:#238636'>✅ Unlocked</span>";
        } else {
            statusDiv.style.color = "#f85149";
            statusDiv.innerText = "❌ " + (result.message || "Ghalat Password");
        }
    } catch (err) {
        // Agar yahan error aaya, toh manually API hit karke check karenge
        statusDiv.style.color = "#f85149";
        statusDiv.innerText = "❌ Connection Failed. API dhoondne mein galti hui.";
        console.error("Fetch error:", err);
    } finally {
        btn.disabled = false;
        btn.innerText = "Unlock System";
    }
}

// Auto-Login Check
function checkAuth() {
    if (localStorage.getItem("admin_auth_status") === "active") {
        const loginMod = document.getElementById('login-module');
        const mainPan = document.getElementById('main-panel');
        if(loginMod) loginMod.style.display = 'none';
        if(mainPan) mainPan.style.display = 'block';
    }
}

document.addEventListener("DOMContentLoaded", checkAuth);
window.verifyMasterPassword = verifyMasterPassword;
