// ==========================================================
// 🎛️ WISHES HUB ADMIN - CORE ENGINE & SIDEBAR TOGGLE
// ==========================================================

document.addEventListener('DOMContentLoaded', async () => {
    
    // 1. SESSION VERIFICATION (Security Check)
    // Agar user logged in nahi hai, toh seedhe login.html par phenko
    if (localStorage.getItem('isAdminLoggedIn') !== 'true') {
        window.location.href = "/admin/pages/login.html";
        return;
    }

    console.log("Admin Securely Logged In!");

    // 2. SIDEBAR DYNAMIC LOADER
    const adminWrapper = document.querySelector('.admin-wrapper');
    if (adminWrapper) {
        try {
            // Sidebar template ko fetch kar rahe hain
            const response = await fetch('/admin/sidebar.html');
            if (response.status === 200) {
                const sidebarHtml = await response.text();
                
                // Content ko sidebar wrapper ke andar lagaya
                adminWrapper.insertAdjacentHTML('afterbegin', sidebarHtml);
                console.log("Sidebar Loaded!");
                
                // Sidebar load hone ke baad click toggle engine start hoga
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
            // JavaScript event jo click hone par 'hide' class ko adla-badli karega
            toggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                sidebar.classList.toggle('hide');
            });

            // Agar user sidebar ke bahar workspace par click kare toh mobile me sidebar chhup jaye
            document.querySelector('.content-workspace').addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('hide'); // mobile standard state me hidden rakhega
                }
            });
        }
    }
});
