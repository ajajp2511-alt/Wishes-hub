// Panel Show/Hide Logic
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

// Logout Logic
window.logout = function() {
    localStorage.removeItem("admin_auth_status");
    checkAuth();
}

// Event Listeners setup
document.addEventListener("DOMContentLoaded", function() {
    checkAuth();

    // Buttons par click events attach karna
    const unlockBtn = document.getElementById('unlock-btn');
    const logoutBtn = document.getElementById('logout-btn');

    if (unlockBtn) unlockBtn.addEventListener('click', window.verifyMasterPassword);
    if (logoutBtn) logoutBtn.addEventListener('click', window.logout);
});
