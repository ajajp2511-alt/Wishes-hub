window.verifyMasterPassword = function() {
    const passInput = document.getElementById('admin-pass');
    const statusDiv = document.getElementById('status');

    if (!passInput || !statusDiv) return;

    const password = passInput.value.trim();

    // Role Mapping Logic
    let role = "";
    if (password === "1234") {
        role = "SUPER_ADMIN";
    } else if (password === "editor123") {
        role = "EDITOR";
    }

    if (role !== "") {
        // Auth aur Role dono set karein
        localStorage.setItem("admin_auth_status", "active");
        localStorage.setItem("admin_role", role);
        
        statusDiv.innerText = "✅ Login Successful!";
        statusDiv.style.color = "green";
        
        // Dashboard load karne ke liye reload
        setTimeout(() => {
            window.location.reload();
        }, 500);
    } else {
        statusDiv.innerText = "❌ Ghalat Password!";
        statusDiv.style.color = "red";
    }
};
