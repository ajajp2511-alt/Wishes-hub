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
        // '../' isliye taaki admin folder se nikal kar api folder ko dhoonda ja sake
        const response = await fetch('../api/verify-pass', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: passInput.value.trim() })
        });

        const result = await response.json();

        if (response.ok && result.success) {
            localStorage.setItem("admin_auth_status", "active");
            // UI switch
            document.getElementById('login-module').style.display = 'none';
            document.getElementById('main-panel').style.display = 'block';
            statusDiv.innerHTML = "<span style='color:#238636'>✅ Unlocked</span>";
        } else {
            statusDiv.style.color = "#f85149";
            statusDiv.innerText = "❌ " + (result.message || "Ghalat Password");
        }
    } catch (err) {
        statusDiv.style.color = "#f85149";
        statusDiv.innerText = "❌ Path Error: API nahi mili.";
        console.error(err);
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
