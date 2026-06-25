// ==========================================================
// 🎛️ WISHES HUB ADMIN - DASHBOARD INITIALIZER & TOGGLE LOGIC
// ==========================================================

// Security setup: Page refresh hote hi logout kar do jisse hamesha safe rahe
if (performance.navigation.type === 1 || performance.getEntriesByType("navigation")[0].type === "reload") {
    sessionStorage.removeItem('isAdminLoggedIn');
}

document.addEventListener('DOMContentLoaded', async () => {
    
    // 1. SESSION CONTROL
    if (sessionStorage.getItem('isAdminLoggedIn') !== 'true') {
        window.location.href = "/admin/pages/login.html";
        return;
    }

    console.log("Welcome to Secure Admin Panel Dashboard!");

    // 2. FETCH DYNAMIC SIDEBAR TEMPLATE (Sahi Path Set Kiya)
    const adminWrapper = document.querySelector('.admin-wrapper');
    if (adminWrapper) {
        try {
            // 🔴 CORRECTION: Aapki file screenshot ke mutabik pages folder me hai
            let sidebarPath = '/admin/pages/sidebar.html';
            
            const response = await fetch(sidebarPath);
            
            if (response.status === 200) {
                const sidebarHtml = await response.text();
                adminWrapper.insertAdjacentHTML('afterbegin', sidebarHtml);
                console.log("Sidebar Loaded Successfully from pages/sidebar.html!");
                
                // Sidebar template load hone ke baad click toggle logic start hoga
                initSidebarToggleEngine();
            } else {
                console.error("Error: sidebar.html template not found at " + sidebarPath);
            }
        } catch (error) {
            console.error("AJAX Error loading sidebar layout:", error);
        }
    }

    // 3. ☰ BUTTON TOGGLE ENGINE (FOR COMPUTER & MOBILE BOTH)
    function initSidebarToggleEngine() {
        const toggleBtn = document.getElementById('toggle-sidebar-btn');
        const sidebar = document.querySelector('.sidebar');
        const workspace = document.querySelector('.content-workspace');

        if (toggleBtn && sidebar) {
            console.log("Toggle button and sidebar successfully mapped!");
            
            toggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                console.log("Hamburger Clicked!");
                
                if (window.innerWidth <= 768) {
                    // Mobile Layout logic
                    sidebar.classList.toggle('show-sidebar');
                } else {
                    // Desktop Layout logic
                    sidebar.classList.toggle('hide');
                }
            });

            // Workspace click par auto close
            if (workspace) {
                workspace.addEventListener('click', () => {
                    if (window.innerWidth <= 768) {
                        sidebar.classList.remove('show-sidebar');
                    }
                });
            }
        } else {
            console.error("Critical: Toggle button or Sidebar structure missing from DOM!");
        }
    }

    // Dropdown population
    populateDropdownsMockData();

    function populateDropdownsMockData() {
        const mainCat = document.getElementById('main-category');
        if (mainCat) {
            const categories = ["Birthday Wishes", "Anniversary", "Festival", "Good Morning"];
            categories.forEach(cat => {
                let opt = document.createElement('option');
                opt.value = cat.toLowerCase().replace(" ", "-");
                opt.innerText = cat;
                mainCat.appendChild(opt);
            });
        }
    }
});
