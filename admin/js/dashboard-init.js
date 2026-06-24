// Wishes Hub: Dashboard Auto-Initializer (New Name to Avoid Conflict)
document.addEventListener('DOMContentLoaded', () => {
    // Check agar user bina login ke index file par aaya hai, toh bhagao use
    if (localStorage.getItem('isAdminLoggedIn') !== 'true') {
        window.location.href = "/admin/login.html";
        return;
    }

    console.log("Admin Panel Unlocked & Initialized!");

    // Default view loading logic (Jo pehle login success par chalta tha)
    setTimeout(() => {
        if (typeof window.loadDefaultAdminView === 'function') {
            window.loadDefaultAdminView();
        } else {
            // Agar main function directly load na ho, toh wishes link click karo
            const defaultLink = document.querySelector('.nav-link[data-feature="wishes"]');
            if (defaultLink) defaultLink.click();
        }
    }, 100);
});
