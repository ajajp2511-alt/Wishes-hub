// Wishes Hub: Admin UI Event Controller
// Core Login & Form Flow Handler - 2026

document.addEventListener('DOMContentLoaded', () => {
    const unlockBtn = document.getElementById('unlock-btn');
    const loginModule = document.getElementById('login-module');
    const mainPanel = document.getElementById('main-panel');
    const statusText = document.getElementById('status');
    const logoutBtn = document.getElementById('logout-btn');

    // Variable to hold verified password for subsequent API requests safely in memory
    let verifiedPassword = "";

    // 🔐 1. HANDLE UNLOCK / LOGIN CLICK
    if (unlockBtn) {
        unlockBtn.addEventListener('click', async () => {
            const passwordField = document.getElementById('admin-password-field');
            const enteredPassword = passwordField?.value || "";

            if (!enteredPassword.trim()) {
                if (statusText) statusText.innerText = "🚨 Please enter a password!";
                return;
            }

            if (statusText) statusText.innerText = "🔑 Verifying password...";

            // Call Pure Auth Logic File (admin-auth.js)
            if (typeof window.verifyAdminPassword === 'function') {
                const response = await window.verifyAdminPassword(enteredPassword);

                if (response.ok) {
                    // Password sahi hai! Save memory token and change screens
                    verifiedPassword = enteredPassword;
                    
                    if (loginModule) loginModule.style.display = 'none';
                    if (mainPanel) mainPanel.style.display = 'block';
                    
                    console.log("Admin Panel Status: Unlocked Securely");
                    
                    // Default behavior: Automatically load wishes form into workspace
                    loadWishesForm();
                } else {
                    // Vercel server rejected the password
                    if (statusText) statusText.innerText = "🚨 Access Denied: " + (response.error || "Wrong Password");
                }
            } else {
                if (statusText) statusText.innerText = "🚨 Error: Authentication module missing!";
            }
        });
    }

    // 🚪 2. HANDLE LOGOUT CLICK
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            verifiedPassword = ""; // Clear password token
            if (mainPanel) mainPanel.style.display = 'none';
            if (loginModule) loginModule.style.display = 'block';
            
            const passwordField = document.getElementById('admin-password-field');
            if (passwordField) passwordField.value = "";
            if (statusText) statusText.innerText = "🚪 Logged out successfully.";
        });
    }

    // ➕ 3. WORKSPACE FORM CONTROLLER (For testing add wishes form)
    function loadWishesForm() {
        const root = document.getElementById('dynamic-content-root');
        if (!root) return;

        // Render the wish creation inputs dynamically inside workspace
        root.innerHTML = `
            <div class="feature-form-card" style="background:#1a1a1a; padding:20px; border-radius:10px; border:1px solid #333;">
                <h3>Add New Content Stream</h3>
                <form id="admin-form">
                    <div style="margin-bottom:15px;">
                        <label style="display:block; margin-bottom:5px;">Wish Text Message:</label>
                        <textarea id="admin-wish-text" rows="4" style="width:100%; padding:10px; border-radius:5px; background:#222; color:white; border:none;" placeholder="Type content..."></textarea>
                    </div>
                    <div style="margin-bottom:15px;">
                        <label style="display:block; margin-bottom:5px;">Telegram File ID:</label>
                        <input type="text" id="admin-tg-id" style="width:100%; padding:10px; border-radius:5px; background:#222; color:white; border:none;" placeholder="Paste image token...">
                    </div>
                    <div style="margin-bottom:20px;">
                        <label style="display:block; margin-bottom:5px;">Category Group:</label>
                        <input type="text" id="admin-category" style="width:100%; padding:10px; border-radius:5px; background:#222; color:white; border:none;" placeholder="e.g., Birthday, Love">
                    </div>
                    <button type="submit" style="padding:10px 20px; background:#00f2ff; border:none; border-radius:5px; color:#111; font-weight:bold; cursor:pointer;">Publish Securely</button>
                </form>
            </div>
        `;

        // Attach submission handler to the newly created form
        const form = document.getElementById('admin-form');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const wishText = document.getElementById('admin-wish-text')?.value || "";
                const tgFileId = document.getElementById('admin-tg-id')?.value || "";
                const category = document.getElementById('admin-category')?.value || "General";

                if (typeof window.publishWishToDatabase === 'function') {
                    const result = await window.publishWishToDatabase(wishText, tgFileId, category, verifiedPassword);
                    if (result.ok) {
                        alert("🚀 Success: Verified & published successfully!");
                        form.reset();
                    } else {
                        alert("🚨 Upload Error: " + result.error);
                    }
                } else {
                    alert("🚨 Error: Core wishes logic file unreachable.");
                }
            });
        }
    }
});
