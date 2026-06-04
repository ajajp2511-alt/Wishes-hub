// 1. Password Verification Logic
window.verifyMasterPassword = function() {
    const passInput = document.getElementById('admin-pass');
    const statusDiv = document.getElementById('status');

    if (!passInput || !statusDiv) return;

    if (passInput.value.trim() === "1234") {
        localStorage.setItem("admin_auth_status", "active");
        window.location.reload(); 
    } else {
        statusDiv.innerText = "❌ Ghalat Password!";
        statusDiv.style.color = "red";
    }
}

// 2. Authentication Check Logic
function checkAuth() {
    const authStatus = localStorage.getItem("admin_auth_status");
    const loginMod = document.getElementById('login-module');
    const mainPan = document.getElementById('main-panel');

    if (authStatus === "active") {
        if (loginMod) loginMod.style.display = 'none';
        if (mainPan) mainPan.style.display = 'block';
    } else {
        if (loginMod) loginMod.style.display = 'block';
        if (mainPan) mainPan.style.display = 'none';
    }
}

// 3. Logout Logic
window.logout = function() {
    localStorage.removeItem("admin_auth_status");
    window.location.reload();
}

// Page load hote hi status check karein
document.addEventListener("DOMContentLoaded", checkAuth);
