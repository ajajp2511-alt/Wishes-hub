// Login logic
async function verifyMasterPassword() {
    const passInput = document.getElementById('admin-pass');
    const statusDiv = document.getElementById('status');
    const btn = document.getElementById('auth-btn');

    if (!passInput.value) {
        alert("Kripya password daalein!");
        return;
    }

    btn.disabled = true;
    btn.innerText = "⏳ Checking...";
    statusDiv.innerText = "";

    try {
        const response = await fetch('/api/verify-pass', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password: passInput.value.trim() })
        });

        const result = await response.json();

        if (response.ok && result.success) {
            // Success! Save session and show panel
            localStorage.setItem("admin_auth", "active");
            showPanel();
        } else {
            // Fail! Show error message
            statusDiv.style.color = "#f85149";
            statusDiv.innerText = "❌ " + (result.message || "Access Denied");
        }
    } catch (err) {
        statusDiv.innerText = "❌ Connection Fail: " + err.message;
    } finally {
        btn.disabled = false;
        btn.innerText = "Unlock System";
    }
}

// UI Helpers
function showPanel() {
    document.getElementById('login-module').style.display = 'none';
    document.getElementById('main-panel').style.display = 'block';
}

function logout() {
    localStorage.removeItem("admin_auth");
    window.location.reload();
}

// Check auth on load
document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("admin_auth") === "active") {
        showPanel();
    }
});

// Window exposure for HTML buttons
window.verifyMasterPassword = verifyMasterPassword;
window.logout = logout;
