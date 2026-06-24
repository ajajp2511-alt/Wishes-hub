document.addEventListener('DOMContentLoaded', () => {
    // Session Verification: Agar logged in nahi hai toh login page par bhejo
    if (localStorage.getItem('isAdminLoggedIn') !== 'true') {
        window.location.href = "/admin/pages/login.html";
        return;
    }

    console.log("Admin Panel Unlocked & Initialized!");

    // Default feature loading/click logic
    setTimeout(() => {
        if (typeof window.loadDefaultAdminView === 'function') {
            window.loadDefaultAdminView();
        } else {
            const defaultLink = document.querySelector('.nav-link[data-feature="wishes"]');
            if (defaultLink) defaultLink.click();
        }
    }, 100);
});
