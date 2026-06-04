document.addEventListener("DOMContentLoaded", () => {
    console.log("Admin panel loaded!");
    const authStatus = localStorage.getItem("admin_auth_status");
    
    if (authStatus === "active") {
        document.getElementById('login-module').style.display = 'none';
        document.getElementById('main-panel').style.display = 'block';
    } else {
        document.getElementById('login-module').style.display = 'block';
        document.getElementById('main-panel').style.display = 'none';
    }
});
