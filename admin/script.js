function checkAuth() {
    const authStatus = localStorage.getItem("admin_auth_status");
    const loginMod = document.getElementById('login-module');
    const mainPan = document.getElementById('main-panel');

    if (authStatus === "active") {
        if(loginMod) loginMod.style.setProperty('display', 'none', 'important');
        if(mainPan) mainPan.style.setProperty('display', 'block', 'important');
    } else {
        if(loginMod) loginMod.style.setProperty('display', 'block', 'important');
        if(mainPan) mainPan.style.setProperty('display', 'none', 'important');
    }
}

document.addEventListener("DOMContentLoaded", checkAuth);
