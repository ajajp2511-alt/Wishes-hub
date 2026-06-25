// ==========================================================
// 🎛️ WISHES HUB ADMIN - CENTRAL ROUTER INITIALIZER LAYER
// ==========================================================

if (performance.navigation.type === 1 || performance.getEntriesByType("navigation")[0].type === "reload") {
    sessionStorage.removeItem('isAdminLoggedIn');
}

document.addEventListener('DOMContentLoaded', async () => {
    
    // 1. SESSION ACCESS LOCK CONTROL
    if (sessionStorage.getItem('isAdminLoggedIn') !== 'true') {
        window.location.href = "/admin/pages/login.html";
        return;
    }

    console.log("Welcome to Secure Admin Panel Dashboard System Core!");

    // 2. SIDEBAR ASYNC LOADER INTERFACES
    const adminWrapper = document.querySelector('.admin-wrapper');
    if (adminWrapper) {
        try {
            let sidebarPath = '/admin/pages/sidebar.html';
            const response = await fetch(sidebarPath);
            if (response.status === 200) {
                const sidebarHtml = await response.text();
                adminWrapper.insertAdjacentHTML('afterbegin', sidebarHtml);
                initSidebarToggleEngine();
                setupSidebarNavigation(); // Navigation listeners activate karein
            }
        } catch (error) {
            console.error("AJAX Error loading sidebar layout:", error);
        }
    }

    // 3. ☰ MOBILE RESPONSIVE NAV TOGGLE ENGINE
    function initSidebarToggleEngine() {
        const toggleBtn = document.getElementById('toggle-sidebar-btn');
        const sidebar = document.querySelector('.sidebar');
        const workspace = document.querySelector('.content-workspace');

        if (toggleBtn && sidebar) {
            toggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (window.innerWidth <= 768) {
                    sidebar.classList.toggle('show-sidebar');
                } else {
                    sidebar.classList.toggle('hide');
                }
            });
            if (workspace) {
                workspace.addEventListener('click', () => {
                    if (window.innerWidth <= 768) {
                        sidebar.classList.remove('show-sidebar');
                    }
                });
            }
        }
    }

    // 4. DEPENDENT DYNAMIC CATEGORY FILLER
    function populateRealCategories() {
        const mainCatDropdown = document.getElementById('main-category');
        const subCatDropdown = document.getElementById('sub-category');
        
        if (typeof categoriesConfig === 'undefined' || !mainCatDropdown || !subCatDropdown) return;

        // Reset main dropdown to prevent duplicates
        mainCatDropdown.innerHTML = '<option value="">Select Main Category</option>';

        Object.keys(categoriesConfig).forEach(mainCat => {
            let opt = document.createElement('option');
            opt.value = mainCat;
            opt.innerText = mainCat;
            mainCatDropdown.appendChild(opt);
        });

        mainCatDropdown.addEventListener('change', function() {
            const selectedMain = this.value;
            subCatDropdown.innerHTML = '<option value="">Select Sub Category</option>';
            if (selectedMain && categoriesConfig[selectedMain]) {
                categoriesConfig[selectedMain].forEach(subCat => {
                    let opt = document.createElement('option');
                    opt.value = subCat;
                    opt.innerText = subCat;
                    subCatDropdown.appendChild(opt);
                });
            }
        });
    }

    // 🔴 5. DYNAMIC COMPONENT CONNECTOR ENGINE (HTML + CSS Injector)
    async function loadLivePreviewComponent() {
        const workspaceArea = document.getElementById('feature-content-area');
        if (!workspaceArea) return;

        try {
            // A. Dynamically CSS File link inject karein head me (agar pehle se nahi hai)
            if (!document.getElementById('live-preview-css')) {
                const cssLink = document.createElement('link');
                cssLink.id = 'live-preview-css';
                cssLink.rel = 'stylesheet';
                cssLink.href = '/admin/css/live-preview-wish.css';
                document.head.appendChild(cssLink);
            }

            // B. Dynamically HTML Component Page fetch karein
            const response = await fetch('/admin/pages/live-preview-wish.html');
            if (response.status === 200) {
                const componentHtml = await response.text();
                
                // Content workspace container ke andar naya HTML daal dein
                workspaceArea.parentElement.innerHTML = componentHtml;

                // C. Dropdowns ko database data config se fill karein
                populateRealCategories();

                // D. Nayi script feature file ka submit logic engine trigger karein
                if (typeof initLivePreviewFeature === 'function') {
                    initLivePreviewFeature();
                    console.log("🎉 Live Preview Component Connected and Active!");
                }
            } else {
                console.error("Failed to load component HTML template.");
            }
        } catch (error) {
            console.error("Error linking component assets:", error);
        }
    }

    // 6. SIDEBAR MENU CLICK SETUP
    function setupSidebarNavigation() {
        // Maan lete hain aapke sidebar menu item par id="menu-add-wish" ya class hai
        // Aap click ke hisab se ise load kar sakte hain. Default test ke liye hum ise auto-load kar rahe hain:
        loadLivePreviewComponent();
    }
});
