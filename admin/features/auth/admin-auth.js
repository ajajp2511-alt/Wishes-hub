function verifyMasterPassword() {
    const passInput = document.getElementById('admin-pass');
    const statusDiv = document.getElementById('status');

    if (passInput.value.trim() === "1234") {
        localStorage.setItem("admin_auth_status", "active");
        window.location.reload(); 
    } else {
        statusDiv.innerText = "❌ Ghalat Password!";
        statusDiv.style.color = "red";
    }
}
window.verifyMasterPassword = verifyMasterPassword;
