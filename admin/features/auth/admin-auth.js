// Password Verification Logic
window.verifyMasterPassword = function() {
    const passInput = document.getElementById('admin-pass');
    const statusDiv = document.getElementById('status');

    if (!passInput || !statusDiv) return;

    if (passInput.value.trim() === "1234") {
        localStorage.setItem("admin_auth_status", "active");
        // Status update karne ke baad checkAuth call karenge jo script.js mein hai
        if (typeof checkAuth === "function") {
            checkAuth();
        } else {
            window.location.reload();
        }
    } else {
        statusDiv.innerText = "❌ Ghalat Password!";
        statusDiv.style.color = "red";
    }
}
