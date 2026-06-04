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

function logout() {
    localStorage.removeItem("admin_auth_status");
    window.location.reload();
}

window.logout = logout;
document.addEventListener("DOMContentLoaded", checkAuth);
