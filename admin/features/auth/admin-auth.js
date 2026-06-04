function verifyMasterPassword() {
    const passInput = document.getElementById('admin-pass');
    const statusDiv = document.getElementById('status');
    const pass = passInput.value.trim();

    if (pass === "1234") {
        localStorage.setItem("admin_auth_status", "active");
        window.location.reload(); // Refresh karke panel dikhayega
    } else {
        statusDiv.innerText = "❌ Ghalat Password!";
        statusDiv.style.color = "red";
    }
}
window.verifyMasterPassword = verifyMasterPassword;
