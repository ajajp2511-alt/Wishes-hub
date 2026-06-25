// ==========================================================
// 🎛️ WISHES HUB ADMIN - CORE ENGINE (REFRESH TO LOCK ENABLED)
// ==========================================================

// 🔴 CRITICAL SECURITY: Page refresh hone par session turant mita do
if (performance.navigation.type === 1 || performance.getEntriesByType("navigation")[0].type === "reload") {
    sessionStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('isAdminLoggedIn'); // Purana bacha kucha data bhi clear
}

document.addEventListener('DOMContentLoaded', async () => {
    
    // 1. SESSION VERIFICATION
    // Agar session me login 'true' nahi hai, toh turant login page par phenko
    if (sessionStorage.getItem('isAdminLoggedIn') !== 'true') {
        window.location.href = "/admin/pages/login.html";
        return;
    }

    console.log("Admin Securely Logged In for this session!");

    // 2. SIDEBAR DYNAMIC LOADER
    const adminWrapper = document.querySelector('.admin-wrapper');
    if (adminWrapper) {
        try {
            const response = await fetch('/admin/sidebar.html');
            if (response.status === 200) {
                const sidebarHtml = await response.text();
                adminWrapper.insertAdjacentHTML('afterbegin', sidebarHtml);
                console.log("Sidebar Loaded!");
                initSidebarToggleEngine();
            } else {
                console.error("Sidebar file not found (404)!");
            }
        } catch (error) {
            console.error("Error loading sidebar:", error);
        }
    }

    // 3. SIDEBAR MOBILE TOGGLE (3-LINE LOGIC)
    function initSidebarToggleEngine() {
        const toggleBtn = document.getElementById('toggle-sidebar-btn');
        const sidebar = document.querySelector('.sidebar');

        if (toggleBtn && sidebar) {
            toggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                sidebar.classList.toggle('hide');
            });

            document.querySelector('.content-workspace').addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('hide');
                }
            });
        }
    }
});
