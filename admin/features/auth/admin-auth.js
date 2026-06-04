// admin/features/auth/admin-auth.js

function verifyMasterPassword() {
    const passInput = document.getElementById('admin-pass');
    const statusDiv = document.getElementById('status');

    if (!passInput || !passInput.value) {
        alert("Kripya password enter karein!");
        return;
    }

    // Aapka fixed password
    if (passInput.value.trim() === "1234") {
        localStorage.setItem("admin_auth_status", "active");
        
        if (statusDiv) {
            statusDiv.style.color = "#238636";
            statusDiv.innerText = "✅ Unlocked!";
        }
        
        // Panel dikhane ke liye page refresh
        setTimeout(() => { window.location.reload(); }, 500);
    } else {
        if (statusDiv) {
            statusDiv.style.color = "#f85149";
            statusDiv.innerText = "❌ Incorrect Password!";
        }
    }
}

window.verifyMasterPassword = verifyMasterPassword;
