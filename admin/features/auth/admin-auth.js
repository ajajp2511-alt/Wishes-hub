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

// Button click event connection
document.addEventListener("DOMContentLoaded", function() {
    const btn = document.getElementById('unlock-btn');
    if(btn) btn.addEventListener('click', window.verifyMasterPassword);
});
