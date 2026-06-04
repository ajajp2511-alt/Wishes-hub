// admin/script.js

function verifyMasterPassword() {
    const passInput = document.getElementById('admin-pass');
    const statusDiv = document.getElementById('status');

    console.log("Attempting login with:", passInput.value);

    // Hardcoded password for immediate fix
    if (passInput.value.trim() === "1234") {
        localStorage.setItem("admin_auth_status", "active");
        showPanel();
        if(statusDiv) statusDiv.innerText = "✅ Unlocked!";
    } else {
        if(statusDiv) {
            statusDiv.style.color = "#f85149";
            statusDiv.innerText = "❌ Ghalat Password!";
        }
    }
}

function showPanel() {
    const loginMod = document.getElementById('login-module');
    const mainPan = document.getElementById('main-panel');
    
    if (loginMod) loginMod.style.display = 'none';
    if (mainPan) mainPan.style.display = 'block';
    
    console.log("Panel should now be visible");
}

function checkAuth() {
    if (localStorage.getItem("admin_auth_status") === "active") {
        showPanel();
    }
}

function logout() {
    localStorage.removeItem("admin_auth_status");
    window.location.reload();
}

// Ensure functions are global for HTML buttons
window.verifyMasterPassword = verifyMasterPassword;
window.logout = logout;

document.addEventListener("DOMContentLoaded", checkAuth);
