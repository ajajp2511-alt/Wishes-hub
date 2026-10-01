// admin/features/login/login-guard.js

export const LoginGuard = {
    init() {
        this.checkExistingSession();
        this.setupBackToWebsiteTrigger();
    },

    checkExistingSession() {
        const token = localStorage.getItem("patel_admin_session_token");
        const expiry = localStorage.getItem("patel_admin_session_expiry");
        
        if (token && expiry && new Date().getTime() < parseInt(expiry, 10)) {
            // Already logged in, redirect to admin dashboard
            window.location.href = "/admin/dashboard.html";
        }
    },

    setupBackToWebsiteTrigger() {
        document.addEventListener("DOMContentLoaded", () => {
            const backBtn = document.getElementById("backToWebBtn");
            if (backBtn) {
                backBtn.addEventListener("click", (e) => {
                    e.preventDefault();
                    // Redirect back to main public website
                    window.location.href = "../../index.html"; 
                });
            }
        });
    }
};
