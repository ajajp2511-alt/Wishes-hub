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

// Button par click event lagana
document.addEventListener("DOMContentLoaded", function() {
    const unlockBtn = document.getElementById('unlock-btn');
    if(unlockBtn) {
        unlockBtn.addEventListener('click', verifyMasterPassword);
    }
});
