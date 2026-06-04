// Function: Password Check via API
window.verifyMasterPassword = async function() {
    const passInput = document.getElementById('admin-pass');
    const btn = document.getElementById('auth-btn');
    const statusDiv = document.getElementById('status');

    if (!passInput.value) {
        alert("Password daaliye!");
        return;
    }

    btn.disabled = true;
    btn.innerText = "⏳ Verifying...";
    statusDiv.innerText = "";

    try {
        const response = await fetch('/api/verify-pass', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: passInput.value })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            // Local storage me login state save karein
            localStorage.setItem("is_admin", "true");
            checkAuth();
        } else {
            statusDiv.style.color = "#f85149";
            statusDiv.innerText = "❌ " + (data.message || "Login Failed");
        }
    } catch (err) {
        statusDiv.style.color = "#f85149";
        statusDiv.innerText = "❌ Server Error!";
    } finally {
        btn.disabled = false;
        btn.innerText = "Unlock System";
    }
};

// Function: Auth State Check
function checkAuth() {
    const loginModule = document.getElementById('login-module');
    const mainPanel = document.getElementById('main-panel');
    
    if (localStorage.getItem("is_admin") === "true") {
        loginModule.style.display = 'none';
        mainPanel.style.display = 'block';
    } else {
        loginModule.style.display = 'block';
        mainPanel.style.display = 'none';
    }
}

// Function: Logout
window.logout = function() {
    localStorage.removeItem("is_admin");
    window.location.reload();
};

// Initial Load Check
document.addEventListener("DOMContentLoaded", checkAuth);
