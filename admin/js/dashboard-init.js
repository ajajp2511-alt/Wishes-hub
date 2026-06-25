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

    // 2. FETCH DYNAMIC SIDEBAR TEMPLATE
    const adminWrapper = document.querySelector('.admin-wrapper');
    if (adminWrapper) {
        try {
            const response = await fetch('/admin/sidebar.html');
            if (response.status === 200) {
                const sidebarHtml = await response.text();
                adminWrapper.insertAdjacentHTML('afterbegin', sidebarHtml);
                console.log("Sidebar Loaded Successfully!");
                
                // Sidebar template load hone ke baad click toggle logic start hoga
                initSidebarToggleEngine();
            } else {
                console.error("Error: sidebar.html template not found!");
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
            toggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                
                if (window.innerWidth <= 768) {
                    // Mobile Layout logic: uses 'show-sidebar' class
                    sidebar.classList.toggle('show-sidebar');
                } else {
                    // Desktop Layout logic: uses standard 'hide' class
                    sidebar.classList.toggle('hide');
                }
            });

            // Agar user mobile par sidebar khol kar main workspace area me click kare, toh sidebar auto-hide ho jaye
            if (workspace) {
                workspace.addEventListener('click', () => {
                    if (window.innerWidth <= 768) {
                        sidebar.classList.remove('show-sidebar');
                    }
                });
            }
        }
    }

    // 4. MOCK DATA FOR DROPDOWNS (Aapke UI ke testing ke liye)
    // Jab tak aap backend dynamic loading nahi jodd rahe, dropdowns khali nahi lagenge
    populateDropdownsMockData();

    function populateDropdownsMockData() {
        const mainCat = document.getElementById('main-category');
        const subCat = document.getElementById('sub-category');
        
        if (mainCat && subCat) {
            // Mock categories loading
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
